//
import FullCalendar from "@fullcalendar/react";
import moment from "moment";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import id from "@fullcalendar/core/locales/id";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useRef, useState } from "react";
import { Button, Drawer, Form, message, Skeleton } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    createPenilaianBulanan,
    getPenilaianBulanan
} from "../../../services/users.service";

const DrawerCreate = ({ visibleCreate, onCloseCreate, date }) => {
    const [form] = Form.useForm();

    return (
        <Drawer
            visible={visibleCreate}
            onClose={onCloseCreate}
            key="create-penilaian-bulanan"
            title="Tambah Penilaian Bulanan"
        >
            <div>{JSON.stringify(date)}</div>
        </Drawer>
    );
};

const DrawerUpdate = ({ visibleUpdate, onCloseUpdate, date }) => {
    const [form] = Form.useForm();
    return <Drawer visible={visibleUpdate} onClose={onCloseUpdate}></Drawer>;
};

const Bulanan = () => {
    const calendarRef = useRef();

    const [visibleCreate, setVisibleCreate] = useState(false);
    const [date, setDate] = useState({ start: null, end: null });

    const onCloseCreate = () => {
        setVisibleCreate(false);
    };

    // state drawer update
    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const onCloseUpdate = () => {
        setVisibleUpdate(false);
    };

    const { data: dataPenilaian, isLoading: loadingPenilaian } = useQuery(
        "penilaian_bulanan",
        () => {
            return getPenilaianBulanan();
        }
    );

    const queryClient = useQueryClient();

    const createDataMutation = useMutation(
        (data) => createPenilaianBulanan(data),
        {
            onError: (error) => console.log(error),
            onSuccess: (data) => {
                message.success("Berhasil ditambahkan");
                queryClient.invalidateQueries("penilaian_bulanan");
                const api = calendarRef.current.getApi();
                api.addEvent(data);
            }
        }
    );

    const handleCreate = () => {
        const data = {
            bulan: 3,
            tahun: 2022,
            title: `Melakukan sesuatu`,
            start: moment(new Date()).add(Math.random() * 3, "days"),
            end: moment(new Date()).add(Math.random() * 3, "days"),
            kuantitas: 100,
            id_target_penilaian: 19
        };

        createDataMutation.mutate(data);
    };

    const handleDateSelect = (info) => {
        const { startStr, endStr } = info;
        setDate({ ...date, start: startStr, end: endStr });
        setVisibleCreate(true);
    };

    return (
        <Skeleton loading={loadingPenilaian}>
            <Button onClick={handleCreate}>Add</Button>
            <FullCalendar
                initialView="dayGridMonth"
                ref={calendarRef}
                nowIndicator
                initialEvents={dataPenilaian}
                plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
                select={handleDateSelect}
                locale={id}
                selectable
            />
            <DrawerCreate
                visibleCreate={visibleCreate}
                onCloseCreate={onCloseCreate}
                date={date}
            />
        </Skeleton>
    );
};

Bulanan.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

export default Bulanan;
