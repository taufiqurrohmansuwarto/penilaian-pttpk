import { Button, message, Modal } from "antd";
import { useMutation, useQueryClient } from "react-query";
import React from "react";
import { useState } from "react";
import { kirimAtasanCuti } from "../../../services/users.service";

const ModalCuti = ({ bulan, tahun, visible, onCancel }) => {
    const queryClient = useQueryClient();

    const { mutate: mutateKirimAtasan } = useMutation(
        (data) => kirimAtasanCuti(data),
        {
            onSuccess: () => {
                onCancel();
                message.success("Cuti Berhasil dilakukan");
                queryClient.invalidateQueries(["data-request-penilaian"]);
                queryClient.invalidateQueries(["data-penilaian"]);
            },
            onError: (err) => {
                console.error(err);
            }
        }
    );

    const okCuti = () => {
        mutateKirimAtasan({ bulan, tahun });
    };

    return (
        <Modal
            onOk={okCuti}
            destroyOnClose
            title="Cuti"
            centered
            visible={visible}
            onCancel={onCancel}
        >
            Apakah anda yakin ingin melakukan cuti di bulan ini? Cuti juga
            dilakukan verifikasi oleh atasan anda.
        </Modal>
    );
};

function PekerjaanBulananCuti({ bulan, tahun }) {
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const onCancel = () => {
        setVisible(false);
    };

    return (
        <>
            <Button onClick={showModal} type="primary">
                Cuti
            </Button>
            <ModalCuti
                bulan={bulan}
                tahun={tahun}
                visible={visible}
                onCancel={onCancel}
            />
        </>
    );
}

export default PekerjaanBulananCuti;
