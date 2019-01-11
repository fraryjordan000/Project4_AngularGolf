import { NameCheckPipe } from './name-check.pipe';

describe('NameCheckPipe', () => {
  it('create an instance', () => {
    const pipe = new NameCheckPipe();
    expect(pipe).toBeTruthy();
  });
});
