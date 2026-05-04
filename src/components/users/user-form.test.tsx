import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { UserForm } from './user-form'
import type { User } from '@/types/user'

// ─── Types ────────────────────────────────────────────────────────────────────
type SetupProps = {
  isSubmitting?: boolean
  defaultUser?: User
  onCancel?: () => void
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const mockUser: User = {
  id: 1,
  name: 'Bob',
  username: 'bob123',
  email: 'bob@test.com',
  phone: '0987654321',
  website: 'example.com',
  address: {
    street: '123 Main St',
    suite: 'Apt 1',
    city: 'HCM',
    zipcode: '70000',
    geo: { lat: '0', lng: '0' },
  },
  company: {
    name: 'Acme',
    catchPhrase: 'Making things',
    bs: 'synergize',
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function setup(props: SetupProps = {}) {
  const onSubmit = vi.fn()
  const user = userEvent.setup()

  render(
    <UserForm
      onSubmit={onSubmit}
      isSubmitting={props.isSubmitting ?? false}
      defaultUser={props.defaultUser}
      onCancel={props.onCancel}
    />
  )

  return { onSubmit, user }
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/tên \*/i), 'Alice Nguyen')
  await user.type(screen.getByLabelText(/email \*/i), 'alice@company.com')
  await user.type(screen.getByLabelText(/phone/i), '0901234567')
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('UserForm', () => {

  it('hiển thị đầy đủ các fields và nút Tạo user khi không có defaultUser', () => {
    setup()

    expect(screen.getByLabelText(/tên \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/website/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/công ty/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/thành phố/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /tạo user/i })
    ).toBeInTheDocument()
  })

  it('button Submit bị disabled khi form chưa được chỉnh sửa', () => {
    setup()

    expect(
      screen.getByRole('button', { name: /tạo user/i })
    ).toBeDisabled()
  })

  it('hiển thị lỗi required khi submit với name và email trống', async () => {
    const { user, onSubmit } = setup()

    // Type vào phone trước để isDirty=true → button enabled
    await user.type(screen.getByLabelText(/phone/i), '0901234567')

    // Blur từng required field để trigger onBlur validation
    await user.click(screen.getByLabelText(/tên \*/i))
    await user.tab()

    await user.click(screen.getByLabelText(/email \*/i))
    await user.tab()

    await user.click(screen.getByRole('button', { name: /tạo user/i }))

    expect(
      await screen.findByText(/tên ít nhất 2 ký tự|tên là bắt buộc/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/email không hợp lệ|email là bắt buộc/i)
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('hiển thị lỗi email khi nhập sai format', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText(/email \*/i), 'not-an-email')
    await user.tab()

    expect(
      await screen.findByText(/email không hợp lệ/i)
    ).toBeInTheDocument()
  })

  it('hiển thị lỗi cross-field khi thiếu cả phone và website', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText(/tên \*/i), 'Alice')
    await user.tab()
    await user.type(screen.getByLabelText(/email \*/i), 'alice@test.com')
    await user.tab()

    await user.click(screen.getByRole('button', { name: /tạo user/i }))

    const crossFieldErrors = await screen.findAllByText(
      /phải có ít nhất phone hoặc website/i
    )
    expect(crossFieldErrors).toHaveLength(2)
  })

  it('gọi onSubmit với data đúng khi form hợp lệ', async () => {
    const { user, onSubmit } = setup()

    await fillValidForm(user)

    await user.click(screen.getByRole('button', { name: /tạo user/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Alice Nguyen',
          email: 'alice@company.com',
          phone: '0901234567',
        }),
        expect.anything()
      )
    })
  })

  it('disable button khi isSubmitting=true', () => {
    setup({ isSubmitting: true })

    const buttons = screen.getAllByRole('button')
    const submitBtn = buttons.find(b =>
      b.textContent?.match(/tạo user|lưu thay đổi/i)
    )
    expect(submitBtn).toBeDisabled()
  })

  it('hiển thị "Lưu thay đổi" và prefill data khi có defaultUser', () => {
    setup({ defaultUser: mockUser })

    expect(
      screen.getByRole('button', { name: /lưu thay đổi/i })
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/tên \*/i)).toHaveValue('Bob')
    expect(screen.getByLabelText(/email \*/i)).toHaveValue('bob@test.com')
  })

  it('hiển thị nút Hủy và gọi onCancel khi click', async () => {
    const onCancel = vi.fn()
    const { user } = setup({ onCancel })

    const cancelBtn = screen.getByRole('button', { name: /hủy/i })
    expect(cancelBtn).toBeInTheDocument()

    await user.click(cancelBtn)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})