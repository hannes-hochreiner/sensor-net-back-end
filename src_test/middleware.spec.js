import {dbGroup} from '../bld/middleware';

describe('Middleware', () => {
  it('can extract the db authorization group', () => {
    let mockReq = {
      get: function(headerName) {
        expect(headerName).toEqual('x-groups');
        return 'write, db:read';
      }
    };
    let nextCalled = false;
    dbGroup(mockReq, null, () => { nextCalled = true });
    expect(mockReq.dbGroup).toEqual('read');
    expect(nextCalled).toBeTrue();
  });

  it('can extract the first db authorization group, if multiple are given', () => {
    let mockReq = {
      get: function(headerName) {
        expect(headerName).toEqual('x-groups');
        return 'write, db:read,db:write';
      }
    };
    let nextCalled = false;
    dbGroup(mockReq, null, () => { nextCalled = true });
    expect(mockReq.dbGroup).toEqual('read');
    expect(nextCalled).toBeTrue();
  });
});
