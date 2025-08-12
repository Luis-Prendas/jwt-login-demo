import { useEffect, useState } from "react";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute";
import { useAuth } from "../hooks/useAuth";
import type { UserData } from "../types/UserManagement";
import { FaStar } from "react-icons/fa";

export default function UserManagement() {
  const { fetchAllUsers, userData } = useAuth()
  const [users, setUsers] = useState<UserData[] | null>(null)

  useEffect(() => {
    const fetch = async () => {
      const users = await fetchAllUsers()
      setUsers(users)
    }
    fetch()
  }, [])

  return (
    <ProtectedAdminRoute>
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-bold">Lista de usuarios</h1>
        {users ? (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th>Nombre de usuario</th>
                <th>Correo electrónico</th>
                <th>Rol</th>
                <th>Puntos de rifa</th>
              </tr>
            </thead>
            <tbody className="text-center border border-[#f0f0f0]/20">
              {users.map((user, index) => (
                <tr key={user.uuid} className={`border-b border-[#f0f0f0]/20 transition-colors ease-in-out cursor-pointer ${index % 2 === 0 ? 'bg-[#242424] hover:bg-[#272727]' : 'hover:bg-[#383838]'}`}>
                  <td className="p-2 flex justify-center items-center gap-1">
                    {userData?.uuid === user.uuid && (
                      <FaStar className="text-yellow-600" />
                    )}
                    {user.username}
                  </td>
                  <td className="p-2">{user.mail}</td>
                  <td className="p-2">{user.role}</td>
                  <td className="p-2">{user.balance.rafflePoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay datos disponibles...</p>
        )}
      </div>
    </ProtectedAdminRoute>
  )
}