import { TestBed } from '@angular/core/testing';

import { CommonTableService } from './common.table.service';

describe('CommonTableService', () => {
  let service: CommonTableService;
  let table:Array<Array<string>> = [
    ["nom", "âge", "taille", "enfants"],
    ["adam", "25", "1.85", "0"],
    ["momo", "50", "x", "3"],
    ["amin", "24", "y", "0"]
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonTableService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('#paddWord should return a word with fixed padding', () => {
    expect(service.paddWord(5, table[0][0])).toBe("nom  |");
  });
  it('#getMaxLength should return for all columns the max length of each elements', () => {
    expect(service.getMaxLength(table)).toEqual([4,3,6,7]);
  });
  it('#paddArray should padd each array element for each col as the numeric in getMaxLength', () => {
    const lengths = service.getMaxLength(table);
    expect(service.paddArray(lengths, table)).toEqual([
      ["nom |", "âge|", "taille|", "enfants|"],
      ["adam|", "25 |", "1.85  |", "0      |"],
      ["momo|", "50 |", "x     |", "3      |"],
      ["amin|", "24 |", "y     |", "0      |"]
    ]);
  });
  it('#arrayToTab should return the tab as array of array in string representation', () => {
    expect(service.arrayToTab(table)).toBe("|nom |âge|taille|enfants|\n|adam|25 |1.85  |0      |\n|momo|50 |x     |3      |\n|amin|24 |y     |0      |");
  });
});
