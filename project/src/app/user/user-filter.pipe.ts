import { Pipe, PipeTransform } from '@angular/core';
import { User } from './user.model';

@Pipe({
  name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {

  transform(users: User[], args: {'1': string, '2': SearchUserEnum}): User[] {
    let input = args['1'];
    let type = args['2'];
    type = SearchUserEnum.User;
    if (input === undefined) {
      input = '';
    }
    input = input.toLowerCase();
    switch (type) {
        case SearchUserEnum.User: {
          return users.filter(u => u.firstname.toLowerCase().match(input) || u.lastname.toLowerCase().match(input)
          || u.firstname.toLowerCase().concat(' ').concat(u.lastname.toLowerCase()).match(input));
        }
        // case SearchUserEnum.Object: {
        //   return users.filter(u => u.lending.filter(o => o.name.toLowerCase().match(input)));
        // }
        // case SearchUserEnum.Place: {
        //   return users.filter(u => u.address.toLowerCase().match(input));
        // }
        case undefined: {
          return users;
        }
    }
  }

}

export enum SearchUserEnum {
  User,
  Object,
  Place
}
