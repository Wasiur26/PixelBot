/* eslint-disable @typescript-eslint/no-explicit-any */
export type Event = {
  name: string;
  once?: boolean;
  execute: (...args: any[]) => Promise<void> | void;
};
