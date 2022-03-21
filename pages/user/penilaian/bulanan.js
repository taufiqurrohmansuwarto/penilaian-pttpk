//
import FullCalendar from "@fullcalendar/react";
import moment from "moment";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import id from "@fullcalendar/core/locales/id";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useRef, useState } from "react";
import {
    Button,
    DatePicker,
    Drawer,
    Form,
    Input,
    InputNumber,
    message,
    Skeleton
} from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    createPenilaianBulanan,
    getPenilaianBulanan
} from "../../../services/users.service";

const DrawerCreate = ({ visibleCreate, onCloseCreate, date, calendarRef }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            kuantitas: null,
            title: null,
            start: moment(date?.start),
            end: moment(date?.end).subtract(1, "days")
        });
    }, [date]);

    const queryClient = useQueryClient();

    const createPenilaianBulananMutation = useMutation(
        (data) => createPenilaianBulanan(data),
        {
            onError: (error) => console.log(error),
            onSuccess: (data) => {
                message.success("Berhasil ditambahkan");
                queryClient.invalidateQueries("penilaian_bulanan");
                const api = calendarRef.current.getApi();
                api.addEvent(data);
                onCloseCreate();
            }
        }
    );

    const handleCreate = async () => {
        const { kuantitas, title, start, end } = await form.getFieldsValue();
        const data = {
            bulan: parseInt(moment(start).format("M")),
            tahun: parseInt(moment(end).format("YYYY")),
            kuantitas,
            title,
            id_target_penilaian: 19,
            start: moment(start),
            end: moment(end).add(1, "days")
        };
        createPenilaianBulananMutation.mutate(data);
    };

    return (
        <Drawer
            visible={visibleCreate}
            onClose={onCloseCreate}
            key="create-penilaian-bulanan"
            title="Tambah Penilaian Bulanan"
            destroyOnClose
            width={720}
            extra={[
                <Button type="primary" onClick={handleCreate}>
                    Submit
                </Button>
            ]}
        >
            <div>
                {JSON.stringify(date)}
                <Form form={form} initialValues={{}} name="form-create-bulanan">
                    <Form.Item
                        label="Deskripsi Pekerjaan"
                        name="title"
                        rules={[
                            { required: true, message: "Tidak boleh kosong" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Tanggal Mulai Pekerjaan" name="start">
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item label="Tanggal Akhir Pekerjaan" name="end">
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item label="Kuantitas" name="kuantitas">
                        <InputNumber />
                    </Form.Item>
                </Form>
            </div>
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

    const handleDateSelect = (info) => {
        console.log(info);
        const { startStr, endStr } = info;
        setDate({ ...date, start: startStr, end: endStr });
        setVisibleCreate(true);
    };

    return (
        <Skeleton loading={loadingPenilaian}>
            <FullCalendar
                initialView="dayGridMonth"
                ref={calendarRef}
                nowIndicator
                initialEvents={dataPenilaian}
                plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
                select={handleDateSelect}
                locale={id}
                nextDayThreshold={"00:00:00"}
                aspectRatio={2}
                selectable
            />
            <DrawerCreate
                calendarRef={calendarRef}
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
