import { Request } from "express";

export type RequestWithUser = Request & { dynamicUserId?: number };