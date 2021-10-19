import { UserDocument } from './../../user/user.model';
import { NextApiRequest } from 'next';

export interface RequestWithUser extends NextApiRequest {
  user: UserDocument
}
