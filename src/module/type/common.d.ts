export interface IJwtPayload {
  id: number;
  name: string;
  email: string;
  type: {
    id: number;
    description: string;
  };
}
