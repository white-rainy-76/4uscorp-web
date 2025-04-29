import { Driver } from '@/entities/driver'
import { useDictionary } from '@/shared/lib/hooks'
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui'
import { Icon } from '@/shared/ui'
import { InfoCard } from '@/shared/ui'
import { Phone, MessageSquare } from 'lucide-react'

type DriverInfoProps = {
  driver?: Driver
}
export const DriverInfo = ({ driver }: DriverInfoProps) => {
  const { dictionary } = useDictionary()
  return (
    <InfoCard title={dictionary.home.headings.driver_info}>
      {/* Верхний блок с тремя колонками */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Водитель */}
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={'https://github.com/shadcn.png'} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-extrabold text-[hsl(var(--text-heading))]">
              Сергей Петров
            </div>
            <div className="text-sm text-green-600">● Свободен</div>
          </div>
        </div>

        {/* Топливо и бонусы */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 border border-dashed rounded-xl pl-[14px] pr-14 py-2 border-spacing-10">
            <Icon name="common/fuel" width={26} height={31} />
            <div>
              <div className="text-sm font-extrabold text-[hsl(var(--text-strong))]">
                50%
              </div>
              <div className="text-sm text-[hsl(var(--text-muted-alt))]">
                {dictionary.home.driver_info.fuel}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24">
              <path d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6l4 4v2h8v-2l4-4z" />
            </svg>
            <span className="text-base font-bold text-[#FFAF2A] whitespace-nowrap">
              5000 - {dictionary.home.driver_info.bonus}
            </span>
          </div>
        </div>

        {/* Действия */}
        <div className="flex gap-3 justify-start sm:justify-end">
          <button className="w-10 h-10 rounded-full border text-[hsl(var(--text-heading))] hover:bg-gray-100 flex items-center justify-center border-[hsl(var(--separator))]">
            <Phone className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full border text-[hsl(var(--text-heading))] hover:bg-gray-100 flex items-center justify-center border-[hsl(var(--separator))]">
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Нижняя таблица */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 pt-4 text-sm">
        <div>
          <span className="text-xs text-[hsl(var(--text-muted))] font-medium">
            {dictionary.home.driver_info.unit_number}
          </span>
          <div className="text-xs font-bold text-[hsl(var(--text-heading))]">
            # 111
          </div>
        </div>
        <div className="border-l pl-4">
          <span className="text-[hsl(var(--text-muted))] font-medium">
            {dictionary.home.driver_info.truck}
          </span>
          <div className="font-bold text-[hsl(var(--text-heading))]">
            2025 FREIGHTLINER CASCADIA
          </div>
        </div>
        <div /> {/* Пусто — под экшены, чтобы сохранить выравнивание */}
      </div>
    </InfoCard>
  )
}
