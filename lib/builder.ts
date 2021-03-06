// import { Board } from '../components/Board';
import * as R from 'rambda';
import * as L from '../lib/index';
import { Status } from '../components/Cell';
import { Board } from '../components/Board';

const emojiTable = [	
	'๐ฆ',	'๐ฆ',	'๐',	'๐ฆ',	'๐ฆ',	'๐ฆ',	'๐',  	'๐',	'๐ฎ', // ๐ป Animals & Nature
	'๐ฉ',	'๐ฆ',	'๐ฆ',	'๐ฑ',	'๐ฆ',	'๐', 	'๐ฆ',	'๐ฌ',  	'๐ ',  
	'โ๏ธ',	'๐',	'๐',	'๐',	'๐ผ',	'๐ธ',	'๐ธ๏ธ',	'๐ด',	'๐ฆ',
	'๐คฏ',	'๐คช',	'๐ค ',	'๐',	'๐ฅต',	'๐ฅถ',	'๐ค',	'๐',	'๐คก', // ๐ Smileys & People
	'๐',	'๐บ',	'๐ป',	'๐ง ',	'๐ง',	'๐งโ๐ณ', '๐จโ๐',	'๐ฉโ๐ฌ',  	'๐จโ๐ป',
	'๐จโ๐',	'๐',	'๐ท',	'๐ง',	'๐ง',	'๐ง',	'๐ง',	'๐',	'๐งถ', 
	'๐ณ',	'๐บ',	'๐ฅ',	'๐ฌ',	'๐น',	'๐ด',	'โท๏ธ',	'๐ง',	'๐', // โฝ Activity
	'๐',	'๐ช',	'โณ',	'๐ฅณ',	'๐ธ',	'๐ข',	'๐ฆฉ',	'๐ฆ',	'๐',
	'๐ฆ',	'๐ฆ',	'๐',	'๐๏ธ',	'๐',	'๐ ',	'๐ก',	'๐จ',	'๐',
	'๐๏ธ',	 '๐๏ธ',	  '๐',   '๐ญ',   '๐ ',   'โฉ๏ธ',   'โ๏ธ',   '๐',   '๐ง'
];

function getRandomIntInclusive(min: number, max: number): number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //ะะฐะบัะธะผัะผ ะธ ะผะธะฝะธะผัะผ ะฒะบะปััะฐัััั
}

export type size = {
	width: number;
	height: number;
};

export type GameBoard = {
	board: Board;
	size: size;
};

interface Builder {
	setSize(width: number, height: number): void;
	setCells(): void;
	getBoard(): GameBoard;
}

export class EmojiBuilder implements Builder {
	private gameBoard: GameBoard = { board: [], size: { width: 0, height: 0 } };

	constructor() {
		this.reset();
	}

	public reset(): void {
		this.gameBoard = { board: [], size: { width: 0, height: 0 } };
	}

	setSize(width: number, height: number): void {
		this.gameBoard.size = {
			width,
			height,
		};
	}

	setCells(): void {
		const { width: m, height: n } = this.gameBoard.size;

		if ((m * n) / 2 > 26) throw new Error('too big');
		if ((m * n) % 2) throw new Error('must be even');

		const rnd = getRandomIntInclusive(0, 20);

		this.gameBoard.board = R.pipe(
			() => R.range(0, (m * n) / 2), // ['๐ฆ', '๐ฆ', '๐', ...]
			R.map((i: number) => emojiTable[i + rnd]),
			R.chain(x => [x, x]),
			L.shuffle,
			R.map((symbol: string) => ({ symbol, status: Status.Closed }))
		)() as Board;
	}

	public getBoard(): GameBoard {
		const result = this.gameBoard;
		this.reset();
		return result;
	}
}

export class WordBuilder implements Builder {
	private gameBoard: GameBoard = { board: [], size: { width: 0, height: 0 } };

	constructor() {
		this.reset();
	}
	public reset(): void {
		this.gameBoard = { board: [], size: { width: 0, height: 0 } };
	}

	setSize(width: number, height: number): void {
		this.gameBoard.size = {
			width,
			height,
		};
	}

	setCells(): void {
		const { width: m, height: n } = this.gameBoard.size;
		const charCodeA = 'A'.charCodeAt(0);
		if ((m * n) / 2 > 26) throw new Error('too big');
		if ((m * n) % 2) throw new Error('must be even');

		this.gameBoard.board = R.pipe(
			() => R.range(0, (m * n) / 2), // ["A", "B", "C"]
			R.map((i: number) => String.fromCharCode(i + charCodeA)),
			R.chain(x => [x, x]),
			L.shuffle,
			R.map((symbol: string) => ({ symbol, status: Status.Closed }))
		)() as Board;
	}

	public getBoard(): GameBoard {
		const result = this.gameBoard;
		this.reset();
		return result;
	}
}

export class Director {
	private builder: Builder;

	constructor(builder: Builder) {
		this.builder = builder;
	}

	public setBuilder(builder: Builder): void {
		this.builder = builder;
	}

	public createLowGameBoard(): GameBoard {
		this.builder.setSize(4, 5);
		this.builder.setCells();
		return this.builder.getBoard();
	}

	public createMedGameBoard(): GameBoard {
		this.builder.setSize(5, 6);
		this.builder.setCells();
		return this.builder.getBoard();
	}

	public createHighGameBoard(): GameBoard {
		this.builder.setSize(6, 7);
		this.builder.setCells();
		return this.builder.getBoard();
	}
}
