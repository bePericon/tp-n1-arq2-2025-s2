import { CRUDRepository } from '../../../shared/domain/repositories/crud-repository';
import { User } from '../entities/user';

export interface UserRepository extends CRUDRepository<User> {}
