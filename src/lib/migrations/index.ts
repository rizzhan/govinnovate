import type { Migration } from "../migrate";
import { migration001 } from "./001-base";

export const migrations: Migration[] = [migration001];
