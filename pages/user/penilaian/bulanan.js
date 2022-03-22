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
    Skeleton,
    Space,
    Table
} from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    createPenilaianBulanan,
    getPenilaianBulanan,
    hapusPenilaianBulanan,
    updatePenilaianBulanan
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
                // const api = calendarRef.current.getApi();
                // api.addEvent(data);
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
                <Button
                    loading={createPenilaianBulananMutation.isLoading}
                    type="primary"
                    onClick={handleCreate}
                >
                    Submit
                </Button>
            ]}
        >
            <div>
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

const DrawerUpdate = ({ visibleUpdate, onCloseUpdate, event, calenderRef }) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    useEffect(() => {
        form.setFieldsValue({
            title: event?.title
        });
    }, []);

    const removePenilaianMutation = useMutation(
        (id) => hapusPenilaianBulanan(id),
        {
            onSuccess: () => {
                message.success("Berhasil dihapus");
                queryClient.invalidateQueries("penilaian");
            }
        }
    );
    const updatePenilaianMutation = useMutation((data) =>
        updatePenilaianBulanan(data)
    );

    const handleRemove = () => {
        removePenilaianMutation.mutate(event?.id);
        event.remove();
        onCloseUpdate();
    };

    return (
        <Drawer
            visible={visibleUpdate}
            destroyOnClose
            width={720}
            onClose={onCloseUpdate}
            extra={[
                <Space>
                    <Button type="danger" onClick={handleRemove}>
                        Hapus
                    </Button>
                    <Button>Ubah</Button>
                </Space>
            ]}
            title="Edit Pekerjaan"
        >
            {JSON.stringify(event?.title)}
            <Form form={form} initialValues={{}}>
                <Form.Item name="title" label="Pekerjaan">
                    <Input />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

const Bulanan = () => {
    const calendarRef = useRef();

    const [visibleCreate, setVisibleCreate] = useState(false);
    const [date, setDate] = useState({ start: null, end: null });
    const [bulan, setBulan] = useState(moment(new Date()).format("M"));
    const [tahun, setTahun] = useState(moment(new Date()).format("YYYY"));

    const [updateEvent, setUpdateEvent] = useState([]);

    useEffect(() => {
        const calendarApi = calendarRef?.current?.getApi();
        calendarApi?.unselect();
        calendarApi?.calendar?.rerenderEvents();
    }, [bulan, tahun]);

    const onCloseCreate = () => {
        setVisibleCreate(false);
    };

    // state drawer update
    const [visibleUpdate, setVisibleUpdate] = useState(false);
    const onCloseUpdate = () => {
        setVisibleUpdate(false);
    };

    const { data: dataPenilaian, isLoading: loadingPenilaian } = useQuery(
        ["penilaian_bulanan", bulan, tahun],
        () => getPenilaianBulanan(bulan, tahun)
    );

    const handleDateSelect = (info) => {
        console.log(info);
        const { startStr, endStr } = info;
        setDate({ ...date, start: startStr, end: endStr });
        setVisibleCreate(true);
    };

    const columns = [
        { title: "Pekerjaan", dataIndex: "title" },
        { title: "Kuantitas", dataIndex: "kuantitas" },
        {
            title: "Satuan",
            key: "satuan",
            render: (_, row) => (
                <div>{row?.target_penilaian?.ref_satuan_kinerja?.nama}</div>
            )
        },
        {
            title: "Induk Pekerjaan",
            key: "induk_pekerjaan",
            render: (_, row) => <div>{row?.target_penilaian?.pekerjaan}</div>
        },
        { title: "Mulai Tanggal", dataIndex: "start" },
        { title: "Akhir Tanggal", dataIndex: "end" },
        { title: "Kualitas", dataIndex: "kualitas" }
    ];

    const renderEventContent = (eventInfo) => {
        return (
            <>
                <b>{eventInfo.created_at}</b>
                <i>{eventInfo.event.title}</i>
            </>
        );
    };

    // handle the change query
    const handleDateSet = (dateInfo) => {
        const { start } = dateInfo;
        const bulan = moment(start).format("M");
        const tahun = moment(start).format("YYYY");
        setBulan(bulan);
        setTahun(tahun);
    };

    const handleEventClick = (e) => {
        const { event } = e;
        setVisibleUpdate(true);
        setUpdateEvent(event);
    };

    return (
        <div style={{ width: "70%" }}>
            {JSON.stringify(dataPenilaian?.length)}
            <FullCalendar
                initialView="dayGridMonth"
                eventMaxStack={3}
                themeSystem="bootstrap5"
                datesSet={handleDateSet}
                dayMaxEventRows={2}
                ref={calendarRef}
                nowIndicator
                showNonCurrentDates={false}
                fixedWeekCount={false}
                events={dataPenilaian}
                plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
                select={handleDateSelect}
                locale={id}
                nextDayThreshold={"00:00:00"}
                aspectRatio={2}
                selectable
                eventClick={handleEventClick}
                eventAdd={function (a) {}}
                eventChange={function () {}}
                eventRemove={function () {}}
            />
            <DrawerCreate
                calendarRef={calendarRef}
                visibleCreate={visibleCreate}
                onCloseCreate={onCloseCreate}
                date={date}
            />
            <DrawerUpdate
                calenderRef={calendarRef}
                visibleUpdate={visibleUpdate}
                onCloseUpdate={onCloseUpdate}
                event={updateEvent}
            />
        </div>
    );
};

Bulanan.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

export default Bulanan;
