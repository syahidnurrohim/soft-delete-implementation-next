"use client";

import {
  bulkDeleteStudentById,
  deleteStudentById,
  getAllStudents,
  getAllUniversities,
} from "@/lib/api";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button, Checkbox, Dropdown, Select, Spinner } from "flowbite-react";
import ExcelJS from "exceljs";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  HiDownload,
  HiPlus,
  HiTrash,
  HiOutlineSearch,
  HiFilter,
  HiChevronDown,
  HiChevronUp,
  HiPencil,
} from "react-icons/hi";
import Swal from "sweetalert2";
import { twMerge } from "tailwind-merge";
import { DebouncedInput } from "@/components/inputs/debounced";
import { rankItem } from "@tanstack/match-sorter-utils";
import { LoadingContext, useLoadingContext } from "@/context/DashboardContext";
import { ModalEdit, ModalTambah } from "./modal";
import { saveAs } from "file-saver";

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
  const [students, setStudents] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilter] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [universityFilters, setUniversityFilters] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [openModalTambah, setOpenModalTambah] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );
  const { setLoading: setFullPageLoading } = useLoadingContext();

  const studentsColumnHelper = createColumnHelper();

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = value
      .map((item) => rankItem(row.getValue(columnId).name, item))
      .sort((a, b) => (a.passed ? -1 : 1))[0];

    // Store the itemRank info
    addMeta({
      itemRank,
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
  };
  const studentsColumn = [
    studentsColumnHelper.display({
      id: "check",
      header: ({ table }) => (
        <Checkbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row, ...props }) => (
        <Checkbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      ),
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
      filterFn: fuzzyFilter,
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
      rowSelection,
      sorting,
      globalFilter,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

  useEffect(() => {
    table.setPagination(pagination);
  }, [pagination]);

  useEffect(() => {
    setTotalRows(table.getFilteredRowModel().rows.length);
  }, [table.getFilteredRowModel().rows.length]);

  const RowActions = ({ row }) => {
    const data = row.original;
    return (
      <div className="flex gap-2">
        <Button
          className="px-0"
          color="purple"
          size="xs"
          onClick={(e) => handleOnClickEditStudent(data)}
        >
          <HiPencil className="h-4 w-4" />
        </Button>
        <Button
          className="px-0"
          color="failure"
          size="xs"
          onClick={(e) => handleOnClickDeleteStudent(data)}
        >
          <HiTrash className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const handleOnClickEditStudent = (data) => {
    setEditData(data);
    setOpenModalEdit(true);
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        setFullPageLoading(true);
        const res = await deleteStudentById(data.uuid);
        setFullPageLoading(false);
        if (!res.ok) {
          Swal.fire("Error", res.statusText, "error");
          return;
        }
        const json = await res.json();
        if (json.status == "success") {
          setStudents(await getData());
          Swal.fire("Success", json.message, "success");
        } else {
          Swal.fire("Error", json.message, "error");
        }
      }
    });
  };

  const handleOnClickOpenModalTambah = (e) => {
    setOpenModalTambah(true);
  };

  const handleOnClickExportExcel = (e) => {
    var ExcelJSWorkbook = new ExcelJS.Workbook();
    var worksheet = ExcelJSWorkbook.addWorksheet("Sheet 1");
    var headers = {
      student_id: "NIM",
      name: "Nama",
      university_id: "Universitas",
      address: "Alamat",
    };
    var columns = ["student_id", "name", "university_id", "address"];

    var headerRow = worksheet.addRow();
    headerRow.font = { bold: true };

    columns.forEach((col, i) => {
      worksheet.getColumn(i + 1).width = 20;
      let cell = headerRow.getCell(i + 1);
      cell.value = headers[col];
    });

    worksheet.properties.outlineProperties = {
      summaryBelow: false,
      summaryRight: false,
    };

    table.getFilteredRowModel().rows.forEach(function (row) {
      var dataRow = worksheet.addRow();
      columns.forEach((col, i) => {
        let cell = dataRow.getCell(i + 1);
        if (col == "university_id") {
          cell.value = row.original.university.name;
        } else {
          cell.value = row.original[col];
        }
      });
    });

    ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `Students.xlsx`,
      );
    });
  };

  const handleOnClickBulkDelete = (e) => {
    const bulkIdToDelete = table.getSelectedRowModel().rows.map((row) => {
      return row.original.uuid;
    });
    Swal.fire({
      title: "Apakah anda yakin?",
      text:
        "Sebanyak " +
        bulkIdToDelete.length +
        " data mahasiswa akan dihapus dari aplikasi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setFullPageLoading(true);
        const res = await bulkDeleteStudentById(bulkIdToDelete);
        setFullPageLoading(false);
        if (!res.ok) {
          Swal.fire("Error", res.statusText, "error");
          return;
        }
        const json = await res.json();
        if (json.status == "success") {
          setStudents(await getData());
          Swal.fire("Success", json.message, "success");
        } else {
          Swal.fire("Error", json.message, "error");
        }
      }
    });
  };

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
    <div className="relative overflow-x-auto p-4">
      <ModalTambah
        {...{
          openModalTambah,
          setOpenModalTambah,
          universities,
          setStudents,
          getData,
        }}
      />
      <ModalEdit
        {...{
          openModalEdit,
          setOpenModalEdit,
          universities,
          setStudents,
          getData,
          initialData: editData,
        }}
      />
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
                checked={universityFilters.includes(item.name)}
                className="me-2"
                onChange={handleOnChangeFilterUniversities}
              />
              {item.name}
            </Dropdown.Item>
          ))}
        </Dropdown>
        <Button
          color="green"
          className="p-0 float-end"
          onClick={(e) => handleOnClickExportExcel(e)}
        >
          <HiDownload className="me-2" />
          Export Excel
        </Button>
        <div className="flex-grow"></div>
        <Button
          outline
          gradientDuoTone="pinkToOrange"
          className="float-end"
          onClick={(e) => handleOnClickBulkDelete(e)}
        >
          <HiTrash className="me-2" />
          Bulk Delete
        </Button>
        <Button
          color="blue"
          className="p-0 float-end"
          onClick={(e) => handleOnClickOpenModalTambah(e)}
        >
          <HiPlus className="me-2" />
          Add Student
        </Button>
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
        <div className="flex gap-4 items-center">
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {pageIndex * pageSize + 1} - {(pageIndex + 1) * pageSize}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalRows}
            </span>
          </span>
          <Select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              setPagination({
                ...pagination,
                pageSize: parseInt(e.target.value),
              });
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
        </div>
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
          <li>
            <button
              href="#"
              onClick={() => {
                setPagination({
                  ...pagination,
                  pageIndex: pagination.pageIndex - 1,
                });
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage()}
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Previous
            </button>
          </li>
          <li>
            <button
              href="#"
              onClick={() => {
                setPagination({
                  ...pagination,
                  pageIndex: pagination.pageIndex + 1,
                });
                table.nextPage();
              }}
              disabled={!table.getCanNextPage()}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default StudentsPage;
