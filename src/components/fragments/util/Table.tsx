import { ChildrenType, ClassNameParam, customTheme } from "../sharedParams";
import { EnumType } from "../../../api/enumCalls";
import { useState, ChangeEventHandler, ChangeEvent } from "react";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { useTranslation } from "react-i18next";
import { Table as Inner, Row, Col, Container } from "react-bootstrap";
import Button from "./Button";
import Spinner from "./Spinner";
import FormControl from "../forms/FormControl";

// Defines column properties
export interface TableColumnParams<T> {
  name: (() => ChildrenType) | string,
  property: ((x: Readonly<T>) => ChildrenType) | string,
  sortBy?: string,
  filterBy?: string,
  size?: number,
  filterEnum?: EnumType
}

// Table component params
export interface TableParams<T> extends ClassNameParam {
  columns: TableColumnParams<T>[],
  data: T[],
  headClass?: string,
  bodyClass?: string,
  rowClass?: string,
  headerClass?: string,
  dataClass?: string,
  isLoading?: boolean
}

// Represents a sort state
interface SortState {
  property: string,
  reversed: boolean
}

// Represents filter values
interface Filter {
  pattern: string,
  enumeration?: EnumType
}

// Custom table with columns generation, filtering and sorting systems
const Table = <T extends Record<string, any>>(props: Readonly<TableParams<T>>) => {
  const [sort, setSort] = useState<SortState>({
    property: "",
    reversed: false
  });

  const [filter, setFilter] = useState<Record<string, Filter>>({});
  const darkMode = useDarkMode();
  const { t } = useTranslation();

  const sortData = (x: string) => setSort({
    property: x,
    reversed: sort.property === x ? !sort.reversed : false
  });

  const filterData = (key: string, value: string, enumeration?: EnumType) => {
    const tmp = { ...filter };
    const data = tmp[key];

    if (data === undefined) {
      tmp[key] = {
        pattern: value,
        enumeration: enumeration
      };
    } else {
      data.pattern = value;
      data.enumeration = enumeration;
    }

    setFilter(tmp);
  };

  let displayData = props.data;

  // Data filtration
  for (const prop in filter) {
    const tmp = filter[prop];

    if (tmp) {
      if (tmp.enumeration) {
        const enumName = tmp.enumeration.name;
        displayData = displayData.filter(e => t(`${enumName}.${e[prop]}`).toLowerCase().includes(tmp.pattern.toLowerCase()));
      } else {
        displayData = displayData.filter(e => e[prop].toString().toLowerCase().includes(tmp.pattern.toLowerCase()));
      }
    }
  }

  // Data sorting
  if (sort.property) {
    displayData.sort((a, b) => {
      if (a[sort.property] < b[sort.property]) {
        return sort.reversed ? 1 : -1;
      }

      if (a[sort.property] > b[sort.property]) {
        return sort.reversed ? -1 : 1;
      }

      return 0;
    });
  }

  return (
    <Inner striped bordered hover variant={customTheme(darkMode)} className={props.className}>
      <thead className={props.headClass}>
        <tr className={props.rowClass}>
          {props.columns.map((col, index) => (
            <th key={index} className={props.headerClass} style={col.size && col.size > 0 && col.size < 100 ? {
              width: `${Math.trunc(col.size)}%`
            } : undefined}>
              {col.sortBy || col.filterBy ? (
                <>
                  <Row className="justify-content-center">
                    {col.filterBy ? <Col><BindableControl callback={e => filterData(col.filterBy ?? "", e.target.value, col.filterEnum)} /></Col> : ""}
                    {col.sortBy ? <Col md="auto"><Button type="button" onClick={e => sortData(col.sortBy ?? "")}>^</Button></Col> : ""}
                  </Row>
                  <Row className="justify-content-center">
                    {typeof(col.name) === "string" ? col.name : col.name()}
                  </Row>
                </>
              ) : (typeof(col.name) === "string" ? col.name : col.name())}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={props.bodyClass}>
        {props.isLoading ? (
          <tr className={props.rowClass}>
            {props.columns.map((col, key) => (
              <td key={key} className={props.dataClass}>
                <Container className="text-center">
                  <Spinner grow />
                </Container>
              </td>
            ))}
          </tr>
        ) : displayData.map((row, index) => (
          <tr key={index} className={props.rowClass}>
            {props.columns.map((col, key) => <td key={key} className={props.dataClass}>{typeof(col.property) === "string" ? row[col.property] : col.property(row)}</td>)}
          </tr>
        ))}
      </tbody>
    </Inner>
  );
};

interface Bind {
  callback: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

// Table search component
const BindableControl = (props: Readonly<Bind>) => {
  const [value, setValue] = useState("");
  const { t } = useTranslation();

  const change = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
    props.callback(e);
  };

  return <FormControl placeholder={t("Common.Search")} value={value} onChange={change} />;
};

export default Table;
