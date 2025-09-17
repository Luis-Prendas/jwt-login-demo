import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOrganizations } from '@/hooks/useOrganizations';
import type { Organization } from '@/types';

type Props = {
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  data: Organization,
  onSuccess?: () => void
}

export function DialogEditOrganization({ isOpen, setIsOpen, data, onSuccess }: Props) {
  // Hook unificado
  const { update, loading } = useOrganizations()

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const corporateName = form.corporateName.value
    const displayName = form.displayName.value
    const slogan = form.slogan.value
    const organizationCode = form.organizationCode.value

    // Usar el método update unificado
    await update(
      data.id,
      {
        corporateName,
        displayName,
        slogan,
        organizationCode,
      },
      undefined, // sin parámetros adicionales para la URL
      () => {
        // Callback de éxito
        setIsOpen(false)
        onSuccess?.()
      }
    )
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[450px] p-0">
        {data ? (
          <form onSubmit={handleSaveChanges} className="flex flex-col gap-4 p-4">
            <DialogHeader>
              <DialogTitle className="flex gap-4">
                Editar Organización
              </DialogTitle>
              <DialogDescription className="text-balance">
                Realiza cambios en la organización. Haz clic en guardar cuando hayas terminado.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="corporateName">Nombre corporativo *</Label>
                <Input disabled={loading} id="corporateName" name="corporateName" type="text" defaultValue={data?.corporateName ?? ""} required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="displayName">Nombre a mostrar *</Label>
                <Input disabled={loading} id="displayName" name="displayName" type="text" defaultValue={data?.displayName ?? ""} required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="slogan">Slogan</Label>
                <Input disabled={loading} id="slogan" name="slogan" type="text" defaultValue={data?.slogan ?? ""} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="organizationCode">Código de organización *</Label>
                <Input id="organizationCode" name="organizationCode" type="text" defaultValue={data?.organizationCode ?? ""} className="cursor-not-allowed" disabled required />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Guardar cambios</Button>
            </DialogFooter>
          </form>
        ) : (
          <DialogHeader>
            <DialogTitle className="flex gap-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Cargando...
            </DialogTitle>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
}