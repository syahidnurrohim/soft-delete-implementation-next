import { Modal, Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";

export const ModalTambah = ({
  openModalTambah,
  setOpenModalTambah,
  universities,
}) => {
  return (
    <Modal show={openModalTambah} onClose={() => setOpenModalTambah(false)}>
      <Modal.Header>Tambah Student</Modal.Header>
      <Modal.Body>
        <form className="flex px-6 flex-col mt-4 gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="nim" value="NIM" />
            </div>
            <TextInput id="nim" type="text" placeholder="NIM" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Nama" />
            </div>
            <TextInput id="name" type="text" placeholder="Nama" required />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setOpenModalTambah(false)}>I accept</Button>
        <Button color="gray" onClick={() => setOpenModalTambah(false)}>
          Decline
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
