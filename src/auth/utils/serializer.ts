import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { UserService } from '../../user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly _userService: UserService) {
    super();
  }

  serializeUser(user: any, done: (param1: any, param2: any) => void) {
    done(null, user);
  }

  async deserializeUser(
    payload: any,
    done: (param1: any, param2: any) => void,
  ) {
    const user = await this._userService.getAgent(payload.id);
    return user ? done(null, user) : done(null, null);
  }
}
