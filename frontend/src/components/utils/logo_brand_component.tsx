export function LogoAndBrandComponent() {

    return (
        <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <span className="text-accent-foreground font-bold text-lg">КЗ</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">Контент Завод</h1>
            </div>
            <p className="text-muted-foreground">Автоматизация создания контента для социальных сетей</p>
        </div>
    )
}