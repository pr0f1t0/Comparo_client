import { Injectable, signal, computed, inject } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';
import { SavedListService } from '../../shared/services/saved-list.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private keycloak = new Keycloak({
    url: environment.keycloak.url,
    realm: environment.keycloak.realm,
    clientId: environment.keycloak.clientId,
  });

  private readonly savedListService = inject(SavedListService);

  private readonly _authenticated = signal(false);
  private readonly _userProfile = signal<Keycloak.KeycloakProfile | null>(null);

  readonly authenticated = this._authenticated.asReadonly();
  readonly userProfile = this._userProfile.asReadonly();

  readonly fullName = computed(() => {
    const profile = this._userProfile();
    if (!profile) return null;
    return [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.username || null;
  });

  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
      });

      this._authenticated.set(authenticated);

      if (authenticated) {
        const profile = await this.keycloak.loadUserProfile();
        this._userProfile.set(profile);
        if (this.keycloak.subject) {
          this.savedListService.initForUser(this.keycloak.subject);
        }
      }

      this.keycloak.onTokenExpired = () => {
        this.keycloak.updateToken(30).catch(() => this.logout());
      };

      return authenticated;
    } catch (error) {
      console.warn('Keycloak init failed, continuing as unauthenticated:', error);
      this._authenticated.set(false);
      return false;
    }
  }

  login(): Promise<void> {
    return this.keycloak.login({ redirectUri: window.location.origin });
  }

  register(): Promise<void> {
    return this.keycloak.register({ redirectUri: window.location.origin });
  }

  logout(): Promise<void> {
    this._authenticated.set(false);
    this._userProfile.set(null);
    this.savedListService.clear();
    return this.keycloak.logout({ redirectUri: window.location.origin });
  }

  async updateDisplayName(firstName: string, lastName: string): Promise<void> {
    const current = this._userProfile();
    if (current) {
      this._userProfile.set({ ...current, firstName, lastName });
    }

    try {
      const token = await this.getTokenAsync();
      const accountUrl = `${environment.keycloak.url}/realms/${environment.keycloak.realm}/account`;
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      const getResponse = await fetch(accountUrl, { method: 'GET', headers });
      if (!getResponse.ok) {
        console.warn('Failed to fetch Keycloak account:', getResponse.status);
        return;
      }

      const account = await getResponse.json();
      account.firstName = firstName;
      account.lastName = lastName;

      const postResponse = await fetch(accountUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(account),
      });

      if (!postResponse.ok) {
        console.warn('Failed to update Keycloak profile:', postResponse.status);
      }
    } catch (error) {
      console.warn('Failed to update Keycloak profile:', error);
    }
  }

  hasRole(role: string): boolean {
    return this.keycloak.hasRealmRole(role);
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  async getTokenAsync(): Promise<string> {
    await this.keycloak.updateToken(5);
    return this.keycloak.token!;
  }
}
