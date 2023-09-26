export type LogItem = {
  id: number;
  uid: string;
  questId: number;
  enemy: string;
  minutes: number;
  done: boolean;
  startTime: string;
  createdAt: string;
  updatedAt: string | null;
};
