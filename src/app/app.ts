import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionPanel
} from 'primeng/accordion';
import { Avatar } from 'primeng/avatar';
import { Badge } from 'primeng/badge';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { Chip } from 'primeng/chip';
import { DatePicker } from 'primeng/datepicker';
import { Divider } from 'primeng/divider';
import { InputMask } from 'primeng/inputmask';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { MultiSelect } from 'primeng/multiselect';
import { Password } from 'primeng/password';
import { ProgressBar } from 'primeng/progressbar';
import { RadioButton } from 'primeng/radiobutton';
import { Rating } from 'primeng/rating';
import { Select } from 'primeng/select';
import { Slider } from 'primeng/slider';
import { SplitButton } from 'primeng/splitbutton';
import { Tag } from 'primeng/tag';
import { Textarea } from 'primeng/textarea';
import { Toast } from 'primeng/toast';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Toolbar } from 'primeng/toolbar';

interface DemoModel {
  nombre: string;
  clave: string;
  edad: number | null;
  cedula: string;
  fecha: Date | null;
  distrito: string | null;
  servicios: string[];
  direccion: string;
  terminos: boolean;
  canal: string | null;
  notificaciones: boolean;
  presupuesto: number;
  rating: number | null;
}

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    Avatar,
    Badge,
    Button,
    Card,
    Checkbox,
    Chip,
    DatePicker,
    Divider,
    InputMask,
    InputNumber,
    InputText,
    Message,
    MultiSelect,
    Password,
    ProgressBar,
    RadioButton,
    Rating,
    Select,
    Slider,
    SplitButton,
    Tag,
    Textarea,
    Toast,
    ToggleSwitch,
    Toolbar
  ],
  providers: [MessageService],
  template: `
    <div class="flex min-h-dvh flex-col gap-6 bg-surface-50 p-6">
      <p-toast />

      <p-toolbar>
        <ng-template #start>
          <div class="flex items-center gap-3">
            <span class="pi pi-building text-xl text-primary"></span>
            <h1 class="text-h2">Municipio de Panamá</h1>
          </div>
        </ng-template>
        <ng-template #end>
          <div class="flex items-center gap-2">
            <span class="hidden text-title sm:inline">Ana López</span>
            <p-avatar label="AL" shape="circle" />
          </div>
        </ng-template>
      </p-toolbar>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <p-card class="xl:col-span-2">
          <ng-template #title>Registro de solicitud</ng-template>
          <ng-template #subtitle>Formulario de verificación del preset Faro</ng-template>
          <ng-template #content>
            <form #demoForm="ngForm" class="flex flex-col gap-5" (ngSubmit)="guardar(demoForm)">
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="flex flex-col gap-1.5">
                  <label for="nombre" class="text-title">Nombre completo</label>
                  <input pInputText id="nombre" name="nombre" [(ngModel)]="model.nombre" placeholder="Ej. Ana López" required />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label for="cedula" class="text-title">Cédula</label>
                  <p-inputmask inputId="cedula" name="cedula" mask="9-999-9999" [(ngModel)]="model.cedula" placeholder="0-000-0000" />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label for="clave" class="text-title">Contraseña</label>
                  <p-password inputId="clave" name="clave" [(ngModel)]="model.clave" [toggleMask]="true" [feedback]="false" placeholder="••••••••" />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label for="edad" class="text-title">Edad</label>
                  <p-inputnumber inputId="edad" name="edad" [(ngModel)]="model.edad" [showButtons]="true" [min]="0" [max]="120" suffix=" años" />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label for="fecha" class="text-title">Fecha de nacimiento</label>
                  <p-datepicker inputId="fecha" name="fecha" [(ngModel)]="model.fecha" [showIcon]="true" dateFormat="dd/mm/yy" placeholder="dd/mm/aaaa" />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label for="distrito" class="text-title">Distrito</label>
                  <p-select inputId="distrito" name="distrito" [(ngModel)]="model.distrito" [options]="distritos" optionLabel="label" placeholder="Seleccione…" class="w-full" />
                </div>

                <div class="flex flex-col gap-1.5 md:col-span-2">
                  <span class="text-title">Servicios de interés</span>
                  <p-multiselect name="servicios" [(ngModel)]="model.servicios" [options]="servicios" optionLabel="label" placeholder="Seleccione uno o varios…" class="w-full" />
                </div>

                <div class="flex flex-col gap-1.5 md:col-span-2">
                  <label for="direccion" class="text-title">Dirección</label>
                  <textarea pTextarea id="direccion" name="direccion" [(ngModel)]="model.direccion" rows="3" class="w-full" placeholder="Calle, urbanización, corregimiento…"></textarea>
                </div>
              </div>

              <p-divider />

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="flex items-center gap-2">
                  <p-checkbox name="terminos" [(ngModel)]="model.terminos" [binary]="true" inputId="terminos" />
                  <label for="terminos" class="text-body">Acepto los términos y condiciones</label>
                </div>

                <div class="flex flex-col gap-1.5">
                  <span class="text-title">Canal de preferencia</span>
                  <div class="flex items-center gap-4">
                    @for (canal of canales; track canal.value) {
                      <div class="flex items-center gap-2">
                        <p-radiobutton name="canal" [(ngModel)]="model.canal" [value]="canal.value" [inputId]="canal.value" />
                        <label [for]="canal.value" class="text-body">{{ canal.label }}</label>
                      </div>
                    }
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <p-toggleswitch name="notificaciones" [(ngModel)]="model.notificaciones" inputId="notificaciones" />
                  <label for="notificaciones" class="text-body">Recibir notificaciones</label>
                </div>

                <div class="flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <span class="text-title">Presupuesto mensual</span>
                    <span class="text-body font-semibold text-primary">\${{ model.presupuesto }}</span>
                  </div>
                  <p-slider name="presupuesto" [(ngModel)]="model.presupuesto" class="w-full" />
                </div>

                <div class="flex flex-col gap-1.5">
                  <span class="text-title">Satisfacción</span>
                  <p-rating name="rating" [(ngModel)]="model.rating" />
                </div>
              </div>

              <p-divider />

              <div class="flex flex-wrap items-center gap-2">
                <p-button type="submit" label="Guardar" icon="pi pi-check" [loading]="guardando()" />
                <p-button type="button" label="Reiniciar" icon="pi pi-refresh" severity="secondary" variant="outlined" (onClick)="reiniciar()" />
                <p-button type="button" icon="pi pi-trash" severity="danger" variant="text" ariaLabel="Eliminar" />
                <p-button type="button" icon="pi pi-star" severity="warn" rounded="true" ariaLabel="Favorito" />
                <p-splitbutton label="Más acciones" icon="pi pi-chevron-down" severity="secondary" variant="outlined" [model]="splitItems" />
              </div>
            </form>
          </ng-template>
        </p-card>

        <div class="flex flex-col gap-6">
          <p-card>
            <ng-template #title>Estado de la solicitud</ng-template>
            <ng-template #content>
              <div class="flex flex-col gap-4">
                <div class="flex flex-wrap items-center gap-2">
                  <p-tag severity="success" value="Aprobado" />
                  <p-tag severity="warn" value="Pendiente" />
                  <p-tag severity="danger" value="Rechazado" />
                  <p-tag severity="info" value="En trámite" />
                </div>

                <p-divider />

                <div class="flex flex-wrap items-center gap-2">
                  <p-chip label="Expediente 2026-0147" icon="pi pi-folder-open" />
                  <p-chip label="Cultura" icon="pi pi-palette" />
                </div>

                <p-divider />

                <div class="flex items-center gap-3">
                  <p-badge value="3" severity="danger" />
                  <span class="text-body text-muted-color">Notificaciones sin leer</span>
                </div>

                <div class="flex flex-col gap-2">
                  <p-progressbar [value]="progreso()" />
                  <span class="text-caption text-muted-color">Progreso de la solicitud: {{ progreso() }}%</span>
                </div>

                <p-divider />

                <p-message severity="info">Su solicitud fue recibida el día de hoy.</p-message>
                <p-message severity="success">Documentación verificada correctamente.</p-message>
                <p-message severity="warn">Falta adjuntar un comprobante.</p-message>
                <p-message severity="error">El documento de identidad está vencido.</p-message>
              </div>
            </ng-template>
          </p-card>
        </div>
      </div>

      <p-accordion [value]="acordeonActivo()">
        <p-accordion-panel value="preguntas">
          <p-accordion-header>Preguntas frecuentes</p-accordion-header>
          <p-accordion-content>
            <p class="text-body">¿Cuánto tarda el trámite? El proceso toma hasta 5 días hábiles.</p>
          </p-accordion-content>
        </p-accordion-panel>
        <p-accordion-panel value="seguimiento">
          <p-accordion-header>Seguimiento</p-accordion-header>
          <p-accordion-content>
            <p class="text-body">Puede dar seguimiento a su solicitud con el número de expediente en la ventanilla única.</p>
          </p-accordion-content>
        </p-accordion-panel>
      </p-accordion>
    </div>
  `
})
export class App {
  private readonly messageService = inject(MessageService);

  protected readonly model: DemoModel = this.crearModelo();

  protected readonly distritos = [
    { label: 'Panamá', value: 'panama' },
    { label: 'San Miguelito', value: 'san-miguelito' },
    { label: 'Arraiján', value: 'arraijan' },
    { label: 'La Chorrera', value: 'la-chorrera' }
  ];

  protected readonly servicios = [
    { label: 'Trámites digitales', value: 'digitales' },
    { label: 'Cultura', value: 'cultura' },
    { label: 'Deportes', value: 'deportes' },
    { label: 'Ferias', value: 'ferias' }
  ];

  protected readonly canales = [
    { label: 'Presencial', value: 'presencial' },
    { label: 'En línea', value: 'en-linea' },
    { label: 'Telefónico', value: 'telefonico' }
  ];

  protected readonly progreso = signal(65);
  protected readonly guardando = signal(false);
  protected readonly acordeonActivo = signal('preguntas');

  protected readonly splitItems: MenuItem[] = [
    {
      label: 'Guardar borrador',
      icon: 'pi pi-save',
      command: () => this.notificar('info', 'Borrador', 'El borrador fue guardado.')
    },
    {
      label: 'Imprimir',
      icon: 'pi pi-print',
      command: () => this.notificar('info', 'Impresión', 'Enviado a la impresora.')
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      command: () => this.notificar('error', 'Eliminado', 'La solicitud fue eliminada.')
    }
  ];

  protected guardar(form: NgForm): void {
    if (form.invalid) {
      this.notificar('warn', 'Formulario incompleto', 'Revise los campos marcados en rojo.');
      return;
    }

    this.guardando.set(true);
    setTimeout(() => {
      this.guardando.set(false);
      this.notificar(
        'success',
        'Solicitud enviada',
        `Gracias${this.model.nombre ? `, ${this.model.nombre}` : ''}. Su trámite fue registrado con el expediente 2026-0147.`
      );
    }, 800);
  }

  protected reiniciar(): void {
    Object.assign(this.model, this.crearModelo());
    this.notificar('warn', 'Formulario reiniciado', 'Los valores volvieron a su estado inicial.');
  }

  private notificar(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }

  private crearModelo(): DemoModel {
    return {
      nombre: '',
      clave: '',
      edad: null,
      cedula: '',
      fecha: null,
      distrito: null,
      servicios: [],
      direccion: '',
      terminos: false,
      canal: null,
      notificaciones: true,
      presupuesto: 500,
      rating: null
    };
  }
}
