//

import FullCalendar from "@fullcalendar/react";
import id from "@fullcalendar/core/locales/id";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
    Alert,
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Drawer,
    Form,
    Input,
    InputNumber,
    message,
    Result,
    Row,
    Select,
    Skeleton,
    Space,
    Spin
} from "antd";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getRefSatuanKinerja } from "../../../services/ref.service";
import {
    createPenilaianBulanan,
    getPenilaianAktif,
    getPenilaianBulanan,
    hapusPenilaianBulanan,
    updatePenilaianBulanan
} from "../../../services/users.service";
import UserLayout from "../../../src/components/UserLayout";

const HIDDEN_DAYS = [0];

const DrawerCreate = ({
    visibleCreate,
    onCloseCreate,
    date,
    calendarRef,
    dataTargetPenilaian
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            kuantitas: null,
            title: null,
            start: moment(date?.start),
            end: moment(date?.end).subtract(1, "days"),
            targetId: null
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
        try {
            const { kuantitas, title, start, end, targetId } =
                await form.validateFields();
            const data = {
                bulan: parseInt(moment(start).format("M")),
                tahun: parseInt(moment(end).format("YYYY")),
                kuantitas,
                title,
                id_target_penilaian: targetId,
                start: moment(start),
                end: moment(end).add(1, "days")
            };
            // console.log(data);
            createPenilaianBulananMutation.mutate(data);
        } catch (error) {}
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
            <Form
                form={form}
                requiredMark={false}
                initialValues={{}}
                layout="vertical"
                name="form-create-bulanan"
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Induk Kegiatan"
                            name="targetId"
                            rules={[
                                {
                                    required: true,
                                    message: "Tidak boleh kosong"
                                }
                            ]}
                        >
                            <Select showSearch optionFilterProp="nama">
                                {dataTargetPenilaian?.map((d) => (
                                    <Select.Option
                                        nama={`${d?.pekerjaan}-${d?.ref_satuan_kinerja?.nama}`}
                                        key={d?.id}
                                        value={d?.id}
                                    >
                                        {d?.pekerjaan} - (
                                        {d?.ref_satuan_kinerja?.nama})
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Deskripsi"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: "Tidak boleh kosong"
                                }
                            ]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Mulai Pekerjaan"
                            name="start"
                            rules={[
                                {
                                    required: true,
                                    message: "Tidak boleh kosong"
                                }
                            ]}
                        >
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Akhir Pekerjaan"
                            name="end"
                            rules={[
                                {
                                    required: true,
                                    message: "Tidak boleh kosong"
                                }
                            ]}
                        >
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    label="Kuantitas"
                    name="kuantitas"
                    rules={[{ required: true, message: "Tidak boleh kosong" }]}
                >
                    <InputNumber />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

const DrawerUpdate = ({
    visibleUpdate,
    onCloseUpdate,
    event,
    calenderRef,
    dataTargetPenilaian
}) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    useEffect(() => {
        form.setFieldsValue({
            title: event?.title,
            start: moment(event?.start),
            end: moment(event?.end).subtract(1, "days"),
            kuantitas: parseInt(event?.extendedProps?.kuantitas),
            id_target_penilaian: parseInt(
                event?.extendedProps?.id_target_penilaian
            )
        });
    }, [event]);

    const removePenilaianMutation = useMutation(
        (id) => hapusPenilaianBulanan(id),
        {
            onSuccess: () => {
                message.success("Berhasil dihapus");
                queryClient.invalidateQueries("penilaian");
                onCloseUpdate();
            }
        }
    );
    const updatePenilaianMutation = useMutation(
        (data) => updatePenilaianBulanan(data),
        {
            onSuccess: (data) => {
                const { end, start, title } = data;
                message.success("Berhasil diupdate");
                onCloseUpdate();
                console.log(data);
                // propnya hanya 4 selain itu di taruh di extendedProps

                event.setProp("title", title);
                event.setDates(start, end);
                // e
                event.setExtendedProp("kuantitas", data?.kuantitas);
                event.setExtendedProp(
                    "id_target_penilaian",
                    data?.id_target_penilaian
                );

                queryClient.invalidateQueries("penilaian");
            },
            onError: (error) => console.log(error)
        }
    );

    const handleRemove = () => {
        removePenilaianMutation.mutate(event?.id);
        event.remove();
        onCloseUpdate();
    };

    const handleUpdate = async () => {
        try {
            const { title, kuantitas, start, end, id_target_penilaian } =
                await form.getFieldValue();

            const data = {
                id: event?.id,
                data: {
                    targetId: id_target_penilaian,
                    title,
                    start: moment(start),
                    end: moment(end).add(1, "days"),
                    kuantitas
                }
            };
            updatePenilaianMutation.mutate(data);
        } catch (error) {}
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
                    <Button type="primary" onClick={handleUpdate}>
                        Ubah
                    </Button>
                </Space>
            ]}
            title="Edit Pekerjaan"
        >
            <Form
                form={form}
                requiredMark={false}
                initialValues={{}}
                layout="vertical"
                name="form-create-bulanan"
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Induk Kegiatan"
                            name="id_target_penilaian"
                            rules={[
                                {
                                    required: true,
                                    message: "Tidak boleh kosong"
                                }
                            ]}
                        >
                            <Select showSearch optionFilterProp="nama">
                                {dataTargetPenilaian?.map((d) => (
                                    <Select.Option
                                        nama={`${d?.pekerjaan}-${d?.ref_satuan_kinerja?.nama}`}
                                        key={d?.id}
                                        value={d?.id}
                                    >
                                        {d?.pekerjaan} - (
                                        {d?.ref_satuan_kinerja?.nama})
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Deskripsi"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: "Tidak boleh kosong"
                                }
                            ]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Mulai Pekerjaan"
                            name="start"
                            rules={[
                                {
                                    required: true,
                                    message: "Tidak boleh kosong"
                                }
                            ]}
                        >
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Akhir Pekerjaan"
                            name="end"
                            rules={[
                                {
                                    required: true,
                                    message: "Tidak boleh kosong"
                                }
                            ]}
                        >
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    label="Kuantitas"
                    name="kuantitas"
                    rules={[{ required: true, message: "Tidak boleh kosong" }]}
                >
                    <InputNumber />
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
        () => getPenilaianBulanan(bulan, tahun),
        {
            enabled: !!bulan && !!tahun
        }
    );

    const { data: dataTargetPenilaian, loading: loadingTargetPenilaian } =
        useQuery("target_penilaian", () => getRefSatuanKinerja("target"), {});

    const { data: dataPenilaianAktif, loading: loadingPenilaianAktif } =
        useQuery("penilaian_aktif", () => getPenilaianAktif(), {});

    const handleDateSelect = (info) => {
        const { startStr, endStr } = info;
        setDate({ ...date, start: startStr, end: endStr });
        setVisibleCreate(true);
    };

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

    const handleKirimAtasan = () => {};
    const handleLihatNilai = () => {};
    const handleBatalKirim = () => {};

    const AktifkanPenilaian = () => {
        return (
            <Result
                status="warning"
                title="Sepertinya Penilaian anda belum diaktifkan atau dibuat"
                extra={
                    <Button type="primary" key="console">
                        Buat Penilaian/Aktifikan
                    </Button>
                }
            />
        );
    };

    return (
        <UserLayout title="Penilaian Bulanan">
            <Card
                loading={
                    loadingPenilaian ||
                    loadingPenilaianAktif ||
                    loadingTargetPenilaian
                }
            >
                {dataPenilaianAktif ? (
                    <>
                        <Alert
                            type="warning"
                            message="Perhatian"
                            showIcon
                            description={
                                <div>
                                    <p>
                                        Setelah dirasa sudah silahkan klik
                                        tombol submit
                                    </p>
                                    <Space>
                                        <Button type="primary">
                                            Kirim Atasan
                                        </Button>
                                        <Button type="primary">
                                            Lihat Nilai
                                        </Button>
                                        <Button type="primary">
                                            Batal Kirim
                                        </Button>
                                    </Space>
                                </div>
                            }
                        />
                        <Divider />
                        <FullCalendar
                            initialView="dayGridMonth"
                            eventMaxStack={3}
                            themeSystem="bootstrap5"
                            datesSet={handleDateSet}
                            hiddenDays={HIDDEN_DAYS}
                            dayMaxEventRows={2}
                            ref={calendarRef}
                            nowIndicator
                            showNonCurrentDates={false}
                            fixedWeekCount={false}
                            events={dataPenilaian}
                            plugins={[
                                timeGridPlugin,
                                interactionPlugin,
                                dayGridPlugin
                            ]}
                            select={handleDateSelect}
                            locale={id}
                            nextDayThreshold={"00:00:00"}
                            aspectRatio={2}
                            selectable
                            eventClick={handleEventClick}
                            // eventAdd={function (a) {}}
                            // eventChange={function () {}}
                            // eventRemove={function () {}}
                        />
                        <DrawerCreate
                            dataTargetPenilaian={dataTargetPenilaian}
                            calendarRef={calendarRef}
                            visibleCreate={visibleCreate}
                            onCloseCreate={onCloseCreate}
                            date={date}
                        />
                        <DrawerUpdate
                            calenderRef={calendarRef}
                            dataTargetPenilaian={dataTargetPenilaian}
                            visibleUpdate={visibleUpdate}
                            onCloseUpdate={onCloseUpdate}
                            event={updateEvent}
                        />
                    </>
                ) : (
                    <AktifkanPenilaian />
                )}
            </Card>
        </UserLayout>
    );
};

Bulanan.Auth = {
    roles: ["USER"],
    groups: ["PTTPK"]
};

export default Bulanan;

// todo update dan tata kembali form
