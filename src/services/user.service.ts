import UserModel from "@/models/user.schema";
import { appLogger } from "@/utils/logger";

class UserService {
  exists = async (id: string): Promise<boolean> => {
    const userExists = await UserModel.exists({ first_name: id });
    appLogger.info(userExists);
    return !!userExists;
  };
}

export default new UserService();
