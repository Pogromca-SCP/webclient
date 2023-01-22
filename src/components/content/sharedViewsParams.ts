// Contains type definitions shared in content components
export interface TableViewParams<T> {
  data: T[],
  isLoading: boolean,
  onRemove?: (x: Readonly<T>) => void
}

export interface MapViewHelperParams {
  lat: number,
  lng: number,
  update?: (x: [number, number]) => void
}

export interface MapDataHelperParams<T> extends MapViewHelperParams {
  data: T,
  setData: (x: T) => void
}
