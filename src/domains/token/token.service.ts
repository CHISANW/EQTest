export interface TokenService {
  fillAmount(): Promise<void>;

  sendToken(userId: number): Promise<any>;

  deleteAmount(): Promise<void>;
}
