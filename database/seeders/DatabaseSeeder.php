<?php

namespace Database\Seeders;

use App\Enums\GuideStatus;
use App\Models\Category;
use App\Models\Guide;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with the owner account and a starter
     * batch of real, useful content — enough for the site to be genuinely
     * usable from the first deploy, not an empty shell.
     */
    public function run(): void
    {
        // Idempotent on purpose: this seeder runs on every deploy, not just
        // the first one.
        if (User::where('email', 'admin@tramitescajamarca.pe')->exists()) {
            $this->command->info('Ya está sembrado — se omite.');

            return;
        }

        User::factory()->create([
            'name' => 'Administrador',
            'email' => 'admin@tramitescajamarca.pe',
            'is_admin' => true,
        ]);

        $categories = [
            'Identidad' => [
                'description' => 'DNI, partidas y documentos de identidad.',
                'guides' => [
                    [
                        'title' => 'Renovar tu DNI',
                        'summary' => 'Cómo renovar tu DNI vencido o próximo a vencer en Cajamarca.',
                        'content' => "Tu DNI debe renovarse cuando está por vencer o ya venció. El trámite se hace en la oficina de RENIEC.\n\nPuedes agendar una cita en el portal de RENIEC (www.reniec.gob.pe) para evitar colas, o acercarte directamente en horario de atención.\n\nEl documento nuevo se entrega en el mismo momento si haces el trámite regular, o puedes elegir la modalidad de entrega a domicilio pagando un costo adicional.",
                        'cost' => 'S/ 31.30 (trámite regular)',
                        'where_to_go' => 'RENIEC — Jr. Cruz de Piedra, Cajamarca',
                        'requirements' => ['DNI anterior (así esté vencido)', 'Si es la primera renovación de menor de edad, partida de nacimiento'],
                    ],
                    [
                        'title' => 'Obtener tu partida de nacimiento',
                        'summary' => 'Cómo pedir tu partida de nacimiento en Cajamarca, en original o certificada.',
                        'content' => "La partida de nacimiento se solicita en la Municipalidad donde te registraron, o en cualquier oficina RENIEC si tu nacimiento ya está en el sistema nacional.\n\nSi naciste en Cajamarca, puedes solicitarla en la Municipalidad Provincial. También existe la opción de solicitarla en línea desde el portal de RENIEC si tu acta está digitalizada.",
                        'cost' => 'Aprox. S/ 12.10 (verificar tarifa vigente)',
                        'where_to_go' => 'Municipalidad Provincial de Cajamarca o RENIEC',
                        'requirements' => ['DNI del solicitante', 'Datos completos de la persona (nombre, fecha de nacimiento, padres)'],
                    ],
                ],
            ],
            'Vehículos' => [
                'description' => 'Licencia de conducir, brevete y trámites vehiculares.',
                'guides' => [
                    [
                        'title' => 'Sacar tu licencia de conducir por primera vez',
                        'summary' => 'Requisitos y pasos para obtener tu brevete en Cajamarca.',
                        'content' => "Para sacar tu licencia de conducir por primera vez necesitas aprobar un examen médico, uno de conocimientos y uno de manejo, en una escuela de conductores autorizada.\n\nEl trámite final de emisión de la licencia se hace ante el Ministerio de Transportes y Comunicaciones (MTC) o la entidad autorizada en la región.",
                        'cost' => 'Varía según categoría — consultar en la escuela de manejo',
                        'where_to_go' => 'Escuela de conductores autorizada + MTC Cajamarca',
                        'requirements' => ['DNI vigente', 'Certificado de estudios (según categoría)', 'Certificado médico de aptitud psicosomática', 'Aprobar el curso en escuela de manejo autorizada'],
                    ],
                ],
            ],
            'Municipal' => [
                'description' => 'Licencias, permisos y trámites de la Municipalidad.',
                'guides' => [
                    [
                        'title' => 'Licencia de funcionamiento para un negocio',
                        'summary' => 'Cómo obtener la licencia municipal para abrir tu negocio en Cajamarca.',
                        'content' => "Toda actividad comercial dentro de la provincia de Cajamarca necesita licencia de funcionamiento de la Municipalidad Provincial.\n\nEl trámite se inicia con una solicitud (muchas veces disponible en línea) y una inspección del local. El costo y tiempo varían según el tamaño y giro del negocio.",
                        'cost' => 'Varía según el giro y área del local',
                        'where_to_go' => 'Municipalidad Provincial de Cajamarca',
                        'requirements' => ['DNI o RUC del titular', 'Vigencia de poder (si es empresa)', 'Croquis de ubicación del local', 'Declaración jurada de observancia de condiciones de seguridad'],
                    ],
                ],
            ],
        ];

        foreach ($categories as $categoryName => $data) {
            $category = Category::create([
                'name' => $categoryName,
                'slug' => Str::slug($categoryName),
                'description' => $data['description'],
                'order' => 0,
            ]);

            foreach ($data['guides'] as $guideData) {
                Guide::create([
                    'category_id' => $category->id,
                    'title' => $guideData['title'],
                    'slug' => Str::slug($guideData['title']),
                    'summary' => $guideData['summary'],
                    'content' => $guideData['content'],
                    'cost' => $guideData['cost'],
                    'where_to_go' => $guideData['where_to_go'],
                    'requirements' => $guideData['requirements'],
                    'status' => GuideStatus::Published,
                    'published_at' => now(),
                ]);
            }
        }
    }
}
