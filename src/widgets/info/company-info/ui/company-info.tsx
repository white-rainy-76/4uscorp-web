import { Company } from '@/entities/company'
import { useDictionary } from '@/shared/lib/hooks'
import { Avatar, AvatarFallback, AvatarImage, cn } from '@/shared/ui'
import { Icon } from '@/shared/ui'
import { Phone, MessageSquare } from 'lucide-react'
import { useSetCompanyManagerMutation } from '@/features/company/set-company-manager'
import { Button } from '@/shared/ui'

type CompanyInfoProps = {
  company: Company
}

export const CompanyInfo = ({ company }: CompanyInfoProps) => {
  const { dictionary } = useDictionary()
  const { mutateAsync: setCompanyManager, isPending } =
    useSetCompanyManagerMutation()

  // Получаем первого менеджера из массива
  const manager = company.companyManagers?.[0]

  const handleAddManager = async () => {
    try {
      // Здесь нужно передать userId текущего пользователя и companyId
      // Пока используем заглушку
      await setCompanyManager({
        userId: 'temp-user-id',
        companyId: company.id,
      })
    } catch (error) {
      console.error('Failed to set company manager:', error)
    }
  }

  return (
    <>
      {/* Top section with responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {/* Manager Profile */}
        <div className="flex items-center gap-4">
          {manager ? (
            <>
              <Avatar className="w-12 h-12">
                <AvatarFallback>
                  {manager.fullName
                    ?.split(' ')
                    .map((n: string) => n[0])
                    .join('') || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-extrabold text-text-heading">
                  {manager.fullName}
                </div>
                <div className="text-sm text-text-muted">Менеджер</div>
              </div>
            </>
          ) : (
            <>
              <Avatar className="w-12 h-12">
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm text-text-heading mb-2">
                  Нет менеджера
                </div>
                <Button
                  onClick={handleAddManager}
                  disabled={isPending}
                  size="sm"
                  className="bg-primary text-white hover:bg-primary/90">
                  {isPending ? 'Добавление...' : 'Добавить'}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Trucks Count */}
        <div className="flex items-center gap-2 border border-dashed rounded-xl pl-[14px] pr-14 py-2 border-separator">
          <Icon
            name="common/truck-model"
            width={26}
            height={31}
            className="text-text-muted"
          />
          <div>
            <div className="text-sm font-extrabold text-text-strong">
              {company.trucksCount}
            </div>
            <div className="text-sm text-text-muted-alt">Автопарк</div>
          </div>
          <Icon
            name="common/arrow-right"
            width={20}
            height={20}
            className="text-primary ml-auto"
          />
        </div>

        {/* Drivers Count */}
        <div className="flex items-center gap-2">
          <Icon
            name="common/users"
            width={24}
            height={24}
            className="text-text-muted"
          />
          <div>
            <div className="text-sm font-extrabold text-text-strong">
              {company.driversCount}
            </div>
            <div className="text-sm text-text-muted-alt">Водители</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-start sm:justify-end">
          <ActionButton icon={<Phone className="w-5 h-5" />} />
          <ActionButton icon={<MessageSquare className="w-5 h-5" />} />
        </div>
      </div>
    </>
  )
}

type ActionButtonProps = {
  icon: React.ReactNode
}

const ActionButton = ({ icon }: ActionButtonProps) => (
  <button className="w-10 h-10 rounded-full border text-text-heading hover:bg-gray-100 flex items-center justify-center border-separator">
    {icon}
  </button>
)
