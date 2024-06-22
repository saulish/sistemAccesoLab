import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://oapdhfcqpetesvseddoi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hcGRoZmNxcGV0ZXN2c2VkZG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg4MTg5OTEsImV4cCI6MjAzNDM5NDk5MX0.s2nHvJFhONlKQBry481BHUlWow4BEgPLmCt3p4PWZR4';
const supabase = createClient(supabaseUrl, supabaseKey);



async function fetchData() {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*');

    if (error) {
        console.error('Error al obtener datos:', error.message);
        return;
    }
    console.log(data)

    data.forEach(element => {
      console.log(element.id)
      console.log(element.nombre)

    });
}

fetchData();


export async function fetchCheck(codigo, huella, tarjeta, facial){
    if(!codigo) codigo=-1;
    const { data: datos_biometricos, error } = await supabase
    .from('datos_biometricos')
    .select('codigo, usuarios(nombre, activo)')
    .or('Dhuella.eq.'+huella+', Dfacial.eq.'+facial+', Dtarjeta.eq.'+tarjeta+', codigo.eq.'+codigo)
       
    if (error) {
        console.error('Error al obtener datos:', error.message);
        return;
    }
    console.log(datos_biometricos)  
    const nombre = datos_biometricos[0].usuarios.nombre;
    const actual=datos_biometricos[0].usuarios.activo;

    if(confirm("Eres "+nombre+"?")){
        codigo=datos_biometricos[0].codigo;
        const {res, error}=await supabase
        .from('usuarios')
        .update({ 'activo': !actual })
        .eq('codigo', codigo)
        .select()
        if (error) {
            console.error('Error al hacer check:', error.message);
            return;
        }
        alert(actual?"Hasta luego, "+nombre:"Bienvenido, "+nombre)
    }

}