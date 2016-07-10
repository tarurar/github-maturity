import {BaseSaveTask} from './task';
import {RepoItem} from '../model';

export class SaveRepo extends BaseSaveTask<any> {
  constructor(private dbContext: any, private repoItem: RepoItem) {
    super();
  }

  execute(cb: (err: Error, data?: any) => void): void {
    var tableRef = this.dbContext.child('repos');

    tableRef.child(this.repoItem.id).update({
      'name': this.repoItem.name,
      'full_name': this.repoItem.full_name,
      'forks_count': this.repoItem.forks_count,
      'language': this.repoItem.language,
      'size': this.repoItem.size,
      'stars': this.repoItem.stargazers_count,
      'url': this.repoItem.url,
      'issues': this.repoItem.issues,
      'owner': this.repoItem.owner,
      'updateDate': new Date()
    }, (err) => {
      cb(err, null);
    });
  }
}