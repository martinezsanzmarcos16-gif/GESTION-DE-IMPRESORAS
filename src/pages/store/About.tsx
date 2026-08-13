export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
        <div className="w-full md:w-1/2">
          {/* Placeholder image */}
          <div className="aspect-square bg-muted rounded-2xl overflow-hidden shadow-lg border border-border/50">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" 
              alt="Sofia Amezqueta - Fundadora" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/2 space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium tracking-wider mb-2">
            NUESTRA HISTORIA
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">
            Diseñado con luz, <br />
            <span className="font-semibold text-accent">creado con pasión.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Lumina3D nació en 2026 de la mano de <span className="text-foreground font-medium">Sofía Amezqueta</span>. 
            Nacida en Pamplona el 30 de septiembre de 2002 y con formación en Ingeniería Industrial, 
            Sofía transformó una idea que llevaba mucho tiempo gestándose en una realidad tangible.
          </p>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground">
        <p className="text-lg leading-relaxed mb-6">
          Lo que comenzó como un proyecto de exploración académica durante sus estudios de ingeniería, 
          pronto se convirtió en una obsesión por la precisión, los materiales avanzados y las 
          infinitas posibilidades de la fabricación aditiva. La visión de Lumina3D siempre fue clara: 
          acercar la tecnología de impresión 3D de nivel industrial tanto a profesionales como a entusiastas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div className="p-8 bg-card rounded-2xl border border-border/50 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground mb-4">Misión</h3>
            <p>
              Proporcionar soluciones de impresión 3D innovadoras y de alta calidad, desdibujando la línea 
              entre la imaginación y la realidad. Nos esforzamos por mantener los más altos estándares 
              técnicos mientras fomentamos una comunidad de creadores.
            </p>
          </div>
          <div className="p-8 bg-card rounded-2xl border border-border/50 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground mb-4">Visión</h3>
            <p>
              Convertirnos en el referente líder de manufactura aditiva y diseño en Europa, 
              impulsando el desarrollo sostenible a través de la producción local y personalizada, 
              minimizando el desperdicio y maximizando la eficiencia.
            </p>
          </div>
        </div>

        <p className="text-lg leading-relaxed mb-6">
          Hoy en día, Lumina3D no es solo una tienda, es un centro de innovación. Continuamos investigando nuevos filamentos, 
          optimizando resinas y calibrando meticulosamente nuestros equipos para asegurar que cada capa, 
          cada micra de material, represente la perfección que nuestros clientes esperan.
        </p>
        
        <p className="text-lg leading-relaxed text-center mt-12 italic text-foreground/80">
          "La ingeniería nos da las herramientas; la imaginación define los límites."
          <br/>
          <span className="text-sm font-semibold not-italic mt-4 inline-block text-accent">- Sofía Amezqueta</span>
        </p>
      </div>
    </div>
  );
}
