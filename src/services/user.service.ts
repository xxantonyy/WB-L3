import localforage from 'localforage';
import { genUUID } from '../utils/helpers';

export const ID_DB = '__wb-userId';

class UserService {
  private userId: string | null = null;

  async init() {
    const id = await this.getId();
    window.userId = id;
    console.log('userID:',window.userId );
  }

  async getId(): Promise<string> {
    let id = await localforage.getItem(ID_DB) as string;

    if (!id) id = await this._setId();

    return id;
  }

  private async _setId(): Promise<string> {
    const id = genUUID();
    await localforage.setItem(ID_DB, id);
    return id;
  }

  getUserId(): string | null {
    return this.userId
  }
}

export const userService = new UserService();