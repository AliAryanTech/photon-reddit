
export interface RedditApiType {
	kind: string,
	data: RedditApiData
}

export interface RedditApiData {
	modhash: string,
	dist: number,
	children: RedditApiType[],
	before: string,
	after: string
}

export interface SVGAnimationElement extends SVGElement {
	beginElement(): void;
}

export interface SVGAnimateElement extends SVGAnimationElement {

}

export interface HistoryState {
	title: string,
	index: number,
	url: string,
	optionalData: any
}

export interface PostSorting {
	order: SortPostsOrder,
	timeFrame?: SortPostsTimeFrame
}

export enum SortPostsOrder {
	hot = "hot",
	new = "new",
	top = "top",
	rising = "rising",
	controversial = "controversial",
	gilded = "gilded",
}

export enum SortPostsTimeFrame {
	hour = "hour",
	day = "day",
	week = "week",
	month = "month",
	year = "year",
	all = "all",
}

export enum SortCommentsOrder {
	best = "best",
	top = "top",
	new = "new",
	controversial = "controversial",
	old = "old",
	qa = "qa",
}