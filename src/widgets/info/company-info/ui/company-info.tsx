import { Company } from '@/entities/company'
import { useDictionary } from '@/shared/lib/hooks'
import { Avatar, AvatarFallback, AvatarImage, cn } from '@/shared/ui'
import { Icon } from '@/shared/ui'
import {
  Phone,
  MessageSquare,
  UsersRound,
  ChevronRight,
  Check,
} from 'lucide-react'
import { useSetCompanyManagerMutation } from '@/features/company/set-company-manager'
import { useSetCompanyUserMutation } from '@/features/company/set-company-user'
import { Button } from '@/shared/ui'
import { useAuthStore } from '@/shared/store/auth-store'
import { useRouter } from 'next/navigation'

type CompanyInfoProps = {
  company: Company
}

export const CompanyInfo = ({ company }: CompanyInfoProps) => {
  const { dictionary } = useDictionary()
  const { mutateAsync: setCompanyManager, isPending: isManagerPending } =
    useSetCompanyManagerMutation()
  const { mutateAsync: setCompanyUser, isPending: isUserPending } =
    useSetCompanyUserMutation()
  const { user, selectCompany } = useAuthStore()
  const router = useRouter()

  // Первый менеджер из массива
  const manager = company.companyManagers?.[0]
  const isCurrentCompany = user?.companyId === company.id

  const handleAddManager = async () => {
    try {
      if (!user?.userId) return
      await setCompanyManager({
        userId: user.userId,
        companyId: company.id,
      })
    } catch (error) {
      console.error('Failed to set company manager:', error)
    }
  }

  const handleSelectCompany = async () => {
    if (!isCurrentCompany && user?.userId) {
      try {
        await setCompanyUser({
          userId: user.userId,
          companyId: company.id,
        })

        selectCompany(company.id)
      } catch (error) {
        console.error('Failed to set company user:', error)
      }
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
      {/* Manager Profile */}
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12 flex-shrink-0">
          <AvatarFallback>
            {manager?.fullName
              ?.split(' ')
              .map((n: string) => n[0])
              .join('') || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          {manager ? (
            <div className="font-extrabold text-text-heading">
              {manager.fullName}
            </div>
          ) : (
            <button
              onClick={handleAddManager}
              disabled={isManagerPending}
              className="font-nunito text-[#4964D8] font-extrabold text-base leading-6 hover:underline cursor-pointer">
              {isManagerPending ? 'Добавление...' : 'Добавить +'}
            </button>
          )}
          <div className="text-sm text-text-muted">Менеджер</div>
        </div>
      </div>

      {/* Trucks Count */}
      <div className="max-w-[174px] flex items-center gap-3 border border-dashed rounded-xl px-4 py-2 border-separator min-w-[180px]">
        <Icon
          name="common/truck-model"
          width={24}
          height={27}
          className="text-text-muted flex-shrink-0"
        />
        <div className="flex flex-col">
          <div className="text-sm font-extrabold text-text-strong">
            {company.trucksCount}
          </div>
          <div className="text-sm text-text-muted-alt">Автопарк</div>
        </div>
        <ChevronRight className="w-[27px] h-[27px] text-primary ml-auto flex-shrink-0" />
      </div>

      {/* Company Selection Button */}
      <div className="max-w-[174px] flex items-center justify-center">
        <Button
          onClick={handleSelectCompany}
          disabled={isCurrentCompany || isUserPending}
          variant={isCurrentCompany ? 'outline' : 'default'}
          className={`w-full h-[52px] rounded-xl font-extrabold text-sm ${
            isCurrentCompany
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}>
          {isCurrentCompany ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Выбрана
            </>
          ) : isUserPending ? (
            'Выбор...'
          ) : (
            'Выбрать компанию'
          )}
        </Button>
      </div>

      {/* Drivers Count */}
      <div className="max-w-[174px] flex items-center gap-3 border border-dashed rounded-xl px-4 py-2 border-separator min-w-[160px]">
        <UsersRound className="w-[27px] h-[27px] text-[#4964D8]" />
        <div className="flex flex-col">
          <div className="text-sm font-extrabold text-text-strong">
            {company.driversCount}
          </div>
          <div className="text-sm text-text-muted-alt">Водители</div>
        </div>
        <ChevronRight className="w-[27px] h-[27px] text-primary ml-auto flex-shrink-0" />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-start sm:justify-end">
        <ActionButton icon={<Phone className="w-5 h-5" />} />
        <ActionButton icon={<MessageSquare className="w-5 h-5" />} />
      </div>
    </div>
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
