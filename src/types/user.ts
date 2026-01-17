export interface AuthUser {
  uid: string;
  displayName: string | null;
  username: string | null;
  photoURL: string | null;
  providerId: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}
