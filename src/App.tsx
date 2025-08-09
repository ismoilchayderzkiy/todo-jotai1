import { useAtom } from 'jotai'
import React, { useState } from 'react'
import { api, AtomData } from './counter/counterSlice'
import { Button, Input, Modal, Select } from 'antd'
import axios from 'axios'

const App = () => {
	const [data, setTodo] = useAtom(AtomData)
	const [inpNameAdd, setInpNameAdd] = useState('')
	const [inpNameEdit, setInpNameEdit] = useState('')
	const [statusAdd, setStatusAdd] = useState(null)
	const [idx, setIdx] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isModalOpen1, setIsModalOpen1] = useState(false)

	const showModal = () => setIsModalOpen(true)
	const handleCancel = () => setIsModalOpen(false)

	const showModal1 = (e) => {
		setInpNameEdit(e.name)
		setIdx(e.id)
		setIsModalOpen1(true)
	}
	const handleCancel1 = () => setIsModalOpen1(false)

	const deleteUser = async (id: number) => {
		try {
			await axios.delete(`${api}/${id}`)
			setTodo()
		} catch (error) {
			console.error(error)
		}
	}

	const addUser = async (e: React.FormEvent) => {
		e.preventDefault()
		const obj = { name: inpNameAdd, status: statusAdd }
		try {
			await axios.post(api, obj)
			setIsModalOpen(false)
			setTodo()
			setInpNameAdd('')
		} catch (error) {
			console.error(error)
		}
	}

	const edited = async (e: React.FormEvent) => {
		e.preventDefault()
		const obj = { name: inpNameEdit }
		try {
			await axios.put(`${api}/${idx}`, obj)
			setIsModalOpen1(false)
			setTodo()
		} catch (error) {
			console.error(error)
		}
	}

	const editStatus = async (id: number) => {
		try {
			const opa = data.find(e => e.id === id)
			const updateStatus = { ...opa, status: !opa.status }
			await axios.put(`${api}/${id}`, updateStatus)
			setTodo()
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 font-sans">
			<div className="max-w-2xl mx-auto space-y-6">
				<button
					onClick={showModal}
					className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-indigo-600 text-white text-lg font-medium hover:bg-indigo-700 transition"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
					</svg>
					Add New User
				</button>

				<div className="space-y-4">
					{data.map((e) => (
						<div
							key={e.id}
							className="flex items-center justify-between bg-white rounded-xl shadow-md px-6 py-4 hover:shadow-lg transition"
						>
							<div className="space-y-1">
								<p className="text-lg font-semibold text-gray-800">{e.name}</p>
								<p className="text-sm text-gray-400">ID: {e.id}</p>
							</div>

							<div className="flex items-center gap-2">
								<button
									onClick={() => editStatus(e.id)}
									className={`px-4 py-2 text-sm rounded-lg font-medium text-white transition ${
										e.status
											? 'bg-green-500 hover:bg-green-600'
											: 'bg-gray-400 hover:bg-gray-500'
									}`}
								>
									{e.status ? 'Active' : 'Inactive'}
								</button>
								<button
									onClick={() => showModal1(e)}
									className="px-4 py-2 text-sm rounded-lg font-medium bg-yellow-400 hover:bg-yellow-500 text-white transition"
								>
									Edit
								</button>

								<button
									onClick={() => deleteUser(e.id)}
									className="px-4 py-2 text-sm rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition"
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			</div>

			<Modal title="Add User" open={isModalOpen} footer={null} onCancel={handleCancel}>
				<form onSubmit={addUser} className="space-y-4">
					<Input
						placeholder="Enter name"
						value={inpNameAdd}
						onChange={(e) => setInpNameAdd(e.target.value)}
					/>
					<Select
						style={{ width: '100%' }}
						allowClear
						options={[
							{ value: true, label: 'Active' },
							{ value: false, label: 'Inactive' },
						]}
						onChange={(value) => setStatusAdd(value)}
						placeholder="Select status"
					/>
					<Button
						type="primary"
						htmlType="submit"
						className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
					>
						Add User
					</Button>
				</form>
			</Modal>

			<Modal title="Edit User" open={isModalOpen1} footer={null} onCancel={handleCancel1}>
				<form onSubmit={edited} className="space-y-4">
					<Input
						placeholder="Edit name"
						value={inpNameEdit}
						onChange={(e) => setInpNameEdit(e.target.value)}
					/>
					<Button
						type="primary"
						htmlType="submit"
						className="w-full bg-green-600 hover:bg-green-700 text-white"
					>
						Save Changes
					</Button>
				</form>
			</Modal>
		</div>
	)
}

export default App
