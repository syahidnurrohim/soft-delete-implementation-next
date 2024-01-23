"use client";

import { getAllStudents, getAllUniversities } from "@/lib/api";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button, Checkbox, Dropdown, Spinner } from "flowbite-react";
import { useEffect, useLayoutEffect, useReducer, useState } from "react";
import {
  HiTrash,
  HiOutlineSearch,
  HiFilter,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import Swal from "sweetalert2";
import { twMerge } from "tailwind-merge";
import { createInitialStateStudentReducer, studentReducer } from "./reducer";
import { DebouncedInput } from "@/components/inputs/debounced";

const getData = async () => {
  const res = await getAllStudents();
  if (!res.ok) {
    return [];
  }
  return (await res.json()).data;
};

const getDataUniversities = async () => {
  const res = await getAllUniversities();
  if (!res.ok) {
    return [];
  }
  return (await res.json()).data;
};

const StudentsPage = () => {
  const [state, dispatch] = useReducer(
    studentReducer,
    createInitialStateStudentReducer,
  );
  const [students, setStudents] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilter] = useState([]);
  const [universityFilters, setUniversityFilters] = useState([]);

  const studentsColumnHelper = createColumnHelper();
  const studentsColumn = [
    studentsColumnHelper.display({
      id: "check",
      header: () => <Checkbox />,
      cell: (props) => <Checkbox />,
      enableResizing: false,
      maxSize: 1,
      enableSorting: false,
    }),
    studentsColumnHelper.accessor("student_id", {
      header: () => "NIM",
      cell: (info) => info.getValue(),
    }),
    studentsColumnHelper.accessor("name", {
      header: () => "Nama",
      cell: (info) => info.getValue(),
    }),
    studentsColumnHelper.accessor((row) => row.university, {
      header: () => "Asal Universitas",
      id: "university",
      cell: (info) => {
        var univ = info.getValue();
        if (univ.name) {
          return univ.name;
        }
        return "";
      },
    }),
    studentsColumnHelper.display({
      id: "actions",
      header: () => "Aksi",
      cell: (props) => <RowActions row={props.row} />,
      maxSize: 1,
    }),
  ];

  const table = useReactTable({
    data: students,
    columns: studentsColumn,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
  });

  useEffect(() => {
    (async () => {
      setStudents(await getData());
      setUniversities(await getDataUniversities());
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    var column = table
      .getAllColumns()
      .filter((item) => item.id == "university")[0];
    if (!column) return;
    if (universityFilters.length) {
      column.setFilterValue(universityFilters);
    } else {
      column.setFilterValue("");
    }
  }, [universityFilters]);

  const RowActions = ({ row }) => {
    const data = row.original;
    return (
      <Button
        className="px-1"
        color="failure"
        size="xs"
        onClick={(e) => handleOnClickDeleteStudent(data)}
      >
        <HiTrash className="h-4 w-4" />
      </Button>
    );
  };

  const handleOnClickDeleteStudent = (data) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data mahasiswa " + data.name + " akan dihapus dari aplikasi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if (result.isConfirmed) {
      } else {
      }
    });
  };

  useEffect(() => {
    console.log(columnFilters);
  }, [columnFilters]);

  const handleOnChangeFilterUniversities = (e) => {
    if (e.target.checked) {
      setUniversityFilters(universityFilters.concat(e.target.value));
    } else {
      setUniversityFilters(
        universityFilters.filter((item) => item != e.target.value),
      );
    }
  };
  return (
    <div className="relative overflow-x-auto px-4">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Students
      </h5>
      <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4 py-4">
        <div className="w-full md:w-1/4">
          <form className="flex items-center">
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <HiOutlineSearch />
              </div>
              <DebouncedInput
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Search"
                onChange={(val) => setGlobalFilter(val)}
              />
            </div>
          </form>
        </div>
        <Dropdown
          dismissOnClick={false}
          renderTrigger={({ arrowIcon }) => (
            <button className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              <HiFilter className="me-2" />
              Filter
              <HiChevronDown className={arrowIcon} />
            </button>
          )}
        >
          <Dropdown.Header>
            <span className="block text-sm">Pilih Universitas</span>
          </Dropdown.Header>
          {universities.map((item) => (
            <Dropdown.Item key={item.uuid}>
              <Checkbox
                value={item.name}
                className="me-2"
                onChange={handleOnChangeFilterUniversities}
              />
              {item.name}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className="px-6 py-3"
                  key={header.id}
                  style={{
                    width: `${header.getSize() === 150 ? "" : header.getSize() + "%"}`,
                  }}
                >
                  <div
                    {...{
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                    className={twMerge(
                      "flex items-center",
                      header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : "",
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    {{
                      asc: <HiChevronUp />,
                      desc: <HiChevronDown />,
                    }[header.column.getIsSorted()] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {loading && (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td className="px-6 py-4" colSpan={99}>
                <div
                  role="status"
                  className="flex justify-center gap-3 items-center"
                >
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          )}
          {!loading && !table.getRowModel().rows.length && (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td className="px-6 py-4" colSpan={99}>
                <div
                  role="status"
                  className="flex justify-center gap-3 items-center"
                >
                  <span>Data tidak ditemukan</span>
                </div>
              </td>
            </tr>
          )}
          {!loading &&
            table.getRowModel().rows.map((row) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <td className="px-6 py-4" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      <nav
        className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            1-10
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            1000
          </span>
        </span>
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Previous
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              1
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default StudentsPage;
