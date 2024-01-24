import { useLoadingContext } from "@/context/DashboardContext";
import { postAddStudent, putEditStudent } from "@/lib/api";
import {
  Modal,
  Button,
  Label,
  TextInput,
  Textarea,
  Select,
} from "flowbite-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const ModalTambah = ({
  openModalTambah,
  setOpenModalTambah,
  universities,
  setStudents,
  getData,
}) => {
  const [postData, setPostData] = useState({});
  const { setLoading: setFullPageLoading } = useLoadingContext();
  const handleOnChangeInput = (e) => {
    setPostData({ ...postData, [e.target.id]: e.target.value });
  };
  const handleOnClickSimpanStudent = (e) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data mahasiswa akan ditambahkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, simpan!",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setFullPageLoading(true);
        const res = await postAddStudent(postData);
        setFullPageLoading(false);
        if (!res.ok) {
          Swal.fire("Error", res.statusText, "error");
          return;
        }
        const json = await res.json();
        if (json.status == "success") {
          setOpenModalTambah(false);
          setStudents(await getData());
          Swal.fire("Success", json.message, "success");
        } else {
          Swal.fire("Error", json.message, "error");
        }
      }
    });
  };
  return (
    <Modal show={openModalTambah} onClose={() => setOpenModalTambah(false)}>
      <Modal.Header>Tambah Student</Modal.Header>
      <Modal.Body>
        <form className="flex px-6 flex-col mt-4 gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="student_id" value="NIM" />
            </div>
            <TextInput
              id="student_id"
              type="text"
              placeholder="NIM"
              required
              onChange={(e) => handleOnChangeInput(e)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Nama" />
            </div>
            <TextInput
              id="name"
              type="text"
              placeholder="Nama"
              required
              onChange={(e) => handleOnChangeInput(e)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="university_id" value="Universitas" />
            </div>
            <Select
              onChange={(e) => handleOnChangeInput(e)}
              id="university_id"
              required
            >
              {universities.map((item) => (
                <option value={item.uuid} key={item.uuid}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="address" value="Alamat" />
            </div>
            <Textarea
              id="address"
              placeholder="Alamat"
              required
              onChange={(e) => handleOnChangeInput(e)}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(e) => handleOnClickSimpanStudent(e)} className="p-0">
          Simpan
        </Button>
        <Button color="gray" onClick={() => setOpenModalTambah(false)}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export const ModalEdit = ({
  openModalEdit,
  setOpenModalEdit,
  universities,
  setStudents,
  getData,
  initialData: { uuid, ...editData },
}) => {
  const [putData, setPutData] = useState({ uuid: null, data: {} });
  const { setLoading: setFullPageLoading } = useLoadingContext();
  const handleOnChangeInput = (e) => {
    setPutData({
      ...putData,
      data: { ...putData.data, [e.target.id]: e.target.value },
    });
  };
  const handleOnClickSimpanStudent = (e) => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data mahasiswa akan diubah!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, simpan!",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setFullPageLoading(true);
        const res = await putEditStudent(putData);
        setFullPageLoading(false);
        if (!res.ok) {
          Swal.fire("Error", res.statusText, "error");
          return;
        }
        const json = await res.json();
        if (json.status == "success") {
          setOpenModalEdit(false);
          setStudents(await getData());
          Swal.fire("Success", json.message, "success");
        } else {
          Swal.fire("Error", json.message, "error");
        }
      }
    });
  };

  useEffect(() => {
    setPutData({ uuid, data: editData });
  }, [uuid]);

  return (
    <Modal show={openModalEdit} onClose={() => setOpenModalEdit(false)}>
      <Modal.Header>Edit Student</Modal.Header>
      <Modal.Body>
        <form className="flex px-6 flex-col mt-4 gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="student_id" value="NIM" />
            </div>
            <TextInput
              id="student_id"
              type="text"
              placeholder="NIM"
              required
              value={putData.data.student_id}
              onChange={(e) => handleOnChangeInput(e)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Nama" />
            </div>
            <TextInput
              id="name"
              type="text"
              placeholder="Nama"
              required
              value={putData.data.name}
              onChange={(e) => handleOnChangeInput(e)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="university_id" value="Universitas" />
            </div>
            <Select
              onChange={(e) => handleOnChangeInput(e)}
              id="university_id"
              value={putData.data.university_id}
              required
            >
              {universities.map((item) => (
                <option value={item.uuid} key={item.uuid}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="address" value="Alamat" />
            </div>
            <Textarea
              id="address"
              placeholder="Alamat"
              required
              value={putData.data.address}
              onChange={(e) => handleOnChangeInput(e)}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(e) => handleOnClickSimpanStudent(e)} className="p-0">
          Simpan
        </Button>
        <Button color="gray" onClick={() => setOpenModalEdit(false)}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
