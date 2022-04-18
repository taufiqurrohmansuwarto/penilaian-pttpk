import {
    Button,
    DatePicker,
    Drawer,
    Form,
    Input,
    InputNumber,
    Select,
    Skeleton,
    Space,
    Table
} from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

const DataPenilaianAktif = () => {
    const { data: dataPenilaianAktif } = useQuery(["penilaian_aktif"], () =>
        getPenilaianAktif()
    );
    return <div>{JSON.stringify(dataPenilaianAktif)}</div>;
};

const CreateFormBulanan = ({ targets, form }) => {
    return (
        <Form form={form} name="create-form-bulanan">
            <Form.Item name="id_target_penilaian">
                <Select showSearch optionFilterProp="name">
                    {targets?.map((target) => (
                        <Select.Option
                            value={target?.id}
                            name={target?.pekerjaan}
                        >
                            {target?.pekerjaan}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item name="title">
                <Input.TextArea />
            </Form.Item>
            <Form.Item name="waktu_pekerjaan">
                <DatePicker.RangePicker />
            </Form.Item>
            <Form.Item name="kuantitas">
                <InputNumber />
            </Form.Item>
        </Form>
    );
};
const UpdateFormBulanan = () => {};

const Penilaian = ({ tahun, bulan }) => {
    useEffect(() => {}, [bulan, tahun]);

    const [visibleCreate, setVisibleCreate] = useState(false);
    const [visibleUpdate, setVisibleUpdate] = useState(false);

    const closeVisibleCreate = () => setVisibleCreate(false);
    const closeVisibleUpdate = () => setVisibleUpdate(false);

    const showCreate = () => setVisibleCreate(true);
    const showUpdate = () => setVisibleUpdate(true);

    const { data: dataPenilaian, isLoading: isLoadingDataPenilaian } = useQuery(
        ["data-penilaian", bulan, tahun],
        () => getPenilaianBulanan(bulan, tahun),
        {
            enabled: !!bulan && !!tahun
        }
    );

    // todo create column and custom keys
    const columns = [];

    const {
        data: dataTargetPenilaian,
        isLoading: isLoadingDataTargetPenilaian
    } = useQuery(["target_penilaian"], () => getRefSatuanKinerja("target"));

    const [createForm] = Form.useForm();
    const [updateForm] = Form.useForm();

    const queryClient = useQueryClient();

    const createPenilaianBulananMutation = useMutation(
        (data) => createPenilaianBulanan(data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("data_penilaian");
                createForm.resetFields();
            },
            onError: (e) => {
                console.log(e);
            }
        }
    );

    const updatePenilaianBulannanMutation = useMutation((data) =>
        updatePenilaianBulanan(data)
    );
    const removePenilaianBulananMutation = useMutation((data) =>
        hapusPenilaianBulanan(data)
    );

    const handleSubmitCreate = async () => {
        try {
            const values = await createForm.validateFields();
            const { waktu_pekerjaan, id_target_penilaian, kuantitas, title } =
                values;
            const [mulai, akhir] = waktu_pekerjaan;
            const start = moment(mulai);
            const end = moment(akhir);
            const data = {
                start,
                end,
                id_target_penilaian,
                kuantitas,
                title,
                bulan: parseInt(bulan),
                tahun: parseInt(tahun)
            };

            createPenilaianBulananMutation.mutate(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Skeleton
            loading={isLoadingDataPenilaian || isLoadingDataTargetPenilaian}
        >
            {JSON.stringify(dataTargetPenilaian)}
            {JSON.stringify(dataPenilaian)}
            <Table
                title={() => (
                    <Space>
                        <Button onClick={showCreate}>Create</Button>
                    </Space>
                )}
                footer={() => "Footer"}
                dataSource={dataPenilaian}
                key="id"
                rowKey={(row) => row?.id}
            />
            <Drawer
                key="create"
                onClose={closeVisibleCreate}
                visible={visibleCreate}
                destroyOnClose
                extra={<Button onClick={handleSubmitCreate}>Submit</Button>}
            >
                <CreateFormBulanan
                    form={createForm}
                    targets={dataTargetPenilaian}
                />
            </Drawer>
            <Drawer key="update" visible={visibleUpdate}></Drawer>
        </Skeleton>
    );
};

const BulananBaru = ({ data }) => {
    const [bulan, setBulan] = useState(data?.query?.bulan);
    const [tahun, setTahun] = useState(data?.query?.tahun);

    const router = useRouter();

    useEffect(() => {
        if (!router?.isReady) return;
    }, [router?.query, bulan, tahun]);

    const handleChange = (e) => {
        const bulan = moment(e).format("M");
        const tahun = moment(e).format("YYYY");

        setBulan(bulan);
        setTahun(tahun);
        router.push({
            query: {
                bulan,
                tahun
            }
        });
    };

    return (
        <UserLayout title="Hello world">
            <DatePicker.MonthPicker
                defaultValue={moment(`${tahun}-${bulan}`)}
                onChange={handleChange}
            />
            {/* <DataPenilaianAktif /> */}
            <Penilaian tahun={tahun} bulan={bulan} />
        </UserLayout>
    );
};

export const getServerSideProps = async (ctx) => {
    const tahun = ctx?.query?.tahun || moment(new Date()).format("YYYY");
    const bulan = ctx?.query?.bulan || moment(new Date()).format("M");

    return {
        props: {
            data: {
                query: {
                    tahun,
                    bulan
                }
            }
        }
    };
};

BulananBaru.auth = {
    groups: ["PTTPK"],
    roles: ["USER"]
};

export default BulananBaru;
