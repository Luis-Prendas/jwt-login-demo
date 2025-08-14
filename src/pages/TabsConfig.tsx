import { useEffect, useState } from "react"
import type { TabMenuOption } from "../types/UserManagement";
import { useTabsMenu } from "../hooks/useTabsMenu";
import { MdClose } from "react-icons/md";
import { Link } from "react-router";

export default function TabsConfig() {
  const [modalOpen, setModalOpen] = useState(false);
  const [tabs, setTabs] = useState<TabMenuOption[] | null>(null);
  const { userTabs, userSelectedTab } = useTabsMenu()
  const { fetchAllTabs } = useTabsMenu()

  useEffect(() => {
    const fetch = async () => {
      const tabs = await fetchAllTabs();
      setTabs(tabs);
    };
    fetch();
  }, [])

  return (
    <>
      <div className="flex justify-center items-center gap-4 flex-col">
        <h1 className="text-5xl font-bold">Configuración de Pestañas</h1>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th>Label</th>
              <th>Ruta</th>
              <th>Autenticación</th>
              <th>Roles Permitidos</th>
              <th>Orden</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="text-center border border-[#f0f0f0]/20">
            {tabs && tabs.map((tab, index) => (
              <tr key={tab.uuid} className={`border-b border-[#f0f0f0]/20 transition-colors ease-in-out cursor-pointer ${index % 2 === 0 ? 'bg-[#242424] hover:bg-[#272727]' : 'hover:bg-[#383838]'}`}>
                <td className="p-2">{tab.label}</td>
                <td className="p-2">{tab.route}</td>
                <td className="p-2">{tab.authRequired ? 'Sí' : 'No'}</td>
                <td className="p-2">{tab.rolesAllowed.join(', ')}</td>
                <td className="p-2">{tab.order}</td>
                <td className="p-2 flex gap-2 justify-center items-center">
                  <button className="secondary_btn">Eliminar</button>
                  <button className="main_btn" onClick={() => { setModalOpen(true) }}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <div className="absolute bottom-0 right-0 p-4 backdrop-blur-xs  bg-black/50 w-full h-screen flex justify-center items-center">
          <main className="w-[650px] h-[450px] bg-[#2f2f2f] rounded-xl overflow-hidden shadow-xl flex justify-start items-center border border-white/10">
            <aside className="bg-[#2a2a2a] h-full w-[300px] border-r border-white/10 flex flex-col text-sm">
              <div className="p-2"><button onClick={() => { setModalOpen(false) }} className="hover:bg-[#3a3a3a] cursor-pointer p-2 rounded-full"><MdClose className="text-xl" /></button></div>
              <div className='w-full h-full p-2'>
                <ul className="flex w-full flex-col justify-center items-start">
                  {userTabs && userTabs.map(tab => (
                    <li key={tab.uuid} className='w-full'>
                      <Link to={tab.route} className={`flex gap-2 items-center hover:bg-[#2f2f2f] w-full p-2 justify-start rounded-lg ${tab.uuid === userSelectedTab?.uuid && 'bg-[#232323]'}`}>
                        {tab.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
            <section className="w-full h-full flex flex-col justify-start items-center p-2">
              <div className="w-full border-b border-white/50 pb-2"><h3 className="text-xl">General</h3></div>
              <main>
                MODAL!!!!
              </main>
            </section>
          </main>
        </div>
      )}
    </>
  )
}