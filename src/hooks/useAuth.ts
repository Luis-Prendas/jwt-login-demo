import { s } from "node_modules/framer-motion/dist/types.d-Bq-Qm38R";
import { userRegister } from "../services/Register";
import { allUsersInfo, userAssistance, userInfoWithBadges, userSchedule, userUpdate } from "../services/UserInformatio";
import { useAuthStore } from "../store/cstorage";
import type { Assistance, RegisterData, Schedule, UserData, UserDataWithBadges } from "../types/UserManagement";

export type AssistanceWithSchedule = Assistance & { schedule: Schedule | null };

export function useAuth() {
  const {
    token,
    isAuthenticated,
    loading,
    userData,
    setLoading,
    login,
    logout,
    fetchUserData,
    setToken,
  } = useAuthStore();

  const fetchAllUsers = async (): Promise<UserData[] | null> => {
    setLoading(true);
    if (!token) return null;

    const users = await allUsersInfo(token);
    setLoading(false);
    return users;
  };

  const fetchUserAssistance = async (): Promise<{ assistance: Assistance[], assistanceWithSchedule: AssistanceWithSchedule[] } | null> => {
    setLoading(true);
    if (!userData?.uuid || !token) return null;

    const assistance = await userAssistance(token, userData.uuid);
    const schedule = await userSchedule(token, userData.uuid);

    const assistanceWithSchedule: AssistanceWithSchedule[] | undefined = assistance?.map(item => {
      if (!schedule) return { ...item, schedule: null };
      const scheduleItem = schedule.find(s => s.dayOfWeek === item.dayOfWeek);
      return { ...item, schedule: scheduleItem || null };
    });

    setLoading(false);

    return assistance && schedule && assistanceWithSchedule ? { assistance, assistanceWithSchedule } : null;
  };

  const fetchUserSchedule = async (): Promise<Schedule[] | null> => {
    setLoading(true);
    if (!userData?.uuid || !token) return null;

    const schedule = await userSchedule(token, userData.uuid);
    console.log('Horario obtenido:', schedule);
    setLoading(false);
    return schedule;
  };

  const fetchUserInfoWithBadge = async (userUuid: string): Promise<UserDataWithBadges | null> => {
    setLoading(true);
    if (!userUuid || !token) return null;

    const user = await userInfoWithBadges(token, userUuid)
    setLoading(false);
    return user
  }

  const updateUser = async (userData: UserDataWithBadges) => {
    setLoading(true);
    if (!token) return null;

    const updatedUser = await userUpdate(token, userData);
    setLoading(false);
    return updatedUser;
  };

  const createUser = async (userData: RegisterData) => {
    setLoading(true);
    const newUser = await userRegister(userData);
    setToken(newUser.token)
    setLoading(false);
    return newUser;
  };

  return {
    token,
    isAuthenticated,
    loading,
    userData,
    createUser,
    login,
    logout,
    fetchUserData,
    setToken,
    fetchAllUsers,
    fetchUserInfoWithBadge,
    updateUser,
    fetchUserAssistance,
    fetchUserSchedule
  };
}
