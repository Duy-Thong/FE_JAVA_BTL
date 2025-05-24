import { Button, Form, FormProps, Input, Typography } from 'antd';
import Link from 'next/link';

const { Title } = Typography;

const RegisterForm = ({
    formInstace,
    onSubmit,
}: {
    formInstace: FormProps['form'];
    onSubmit: FormProps['onFinish'];
}) => {
    return (
        <Form
            name="register"
            layout="vertical"
            autoComplete="on"
            size="large"
            form={formInstace}
            onFinish={onSubmit}
        >
            <Form.Item>
                <Title level={3}>Đăng ký</Title>
            </Form.Item>

            <Form.Item
                label="Username"
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập username của bạn',
                        whitespace: true,
                    },
                ]}
            >
                <Input placeholder="Nhập username của bạn" />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập email của bạn',
                        whitespace: true,
                    },
                ]}
            >
                <Input placeholder="Nhập email đăng nhập" />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập Mật khẩu của bạn',
                        whitespace: true,
                    },
                ]}
            >
                <Input.Password placeholder="Nhập mật khẩu đăng nhập" />
            </Form.Item>

            <Form.Item>
                <span>Bạn đã có tài khoản? </span>
                <Link href="/login" scroll={false}>
                    Đăng nhập
                </Link>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Đăng ký
                </Button>
            </Form.Item>
        </Form>
    );
};

export default RegisterForm;
