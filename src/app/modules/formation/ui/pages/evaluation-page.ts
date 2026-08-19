import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { FormationStateService } from '../../services/formation-state.service';
import { QUESTION_TYPE_LABELS, labelOf } from '../../models/formation-labels';
import type { QuestionType } from '../../models/formation.model';

@Component({
  selector: 'app-evaluation-page',
  imports: [
    FormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    TagModule,
    DividerModule,
    RadioButtonModule,
    ProgressSpinnerModule,
    MessageModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="flex flex-col gap-6">
      @if (formationState.evaluationLoading()) {
        <div class="flex items-center justify-center py-20">
          <p-progressSpinner strokeWidth="4" />
        </div>
      } @else if (formationState.evaluationError()) {
        <p-message severity="error">{{ formationState.evaluationError() }}</p-message>
      } @else if (formationState.currentEvaluation(); as evaluation) {
        <section
          class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-950 p-8 shadow-lg md:p-10"
        >
          <div class="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden="true"></div>
          <div class="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-primary-400/20 blur-2xl" aria-hidden="true"></div>

          <div class="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div class="mb-3 flex flex-wrap items-center gap-2">
                <p-tag value="Evaluación" severity="info" />
                <p-tag [value]="'Mínimo: ' + evaluation.minimumScore + '%'" severity="success" />
              </div>
              <h1 class="text-h1 text-white">{{ evaluation.title }}</h1>
              @if (evaluation.description) {
                <p class="mt-2 max-w-xl text-body text-primary-100">{{ evaluation.description }}</p>
              }
            </div>
            <div class="flex items-center gap-2">
              <p-button
                label="Editar datos"
                icon="pi pi-pencil"
                [outlined]="true"
                severity="secondary"
                (onClick)="openEditEvaluationDialog()"
                styleClass="!bg-white/15 !text-white !border-white/30"
              />
              <p-button
                label="Agregar pregunta"
                icon="pi pi-plus"
                (onClick)="openAddQuestionDialog()"
                styleClass="!bg-white !text-primary-700 !border-white shadow-md"
              />
              <a p-button label="Volver" icon="pi pi-arrow-left" [routerLink]="['/formation/courses', courseId]" severity="secondary" [outlined]="true"></a>
            </div>
          </div>
        </section>

        <div class="flex flex-col gap-4">
          @if (evaluation.questions.length === 0) {
            <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-300 py-12 text-center">
              <span class="pi pi-help-circle text-4xl text-surface-300 mb-3" aria-hidden="true"></span>
              <p class="text-body text-muted-color">Esta evaluación no tiene preguntas aún.</p>
            </div>
          } @else {
            @for (question of evaluation.questions; track question.id; let qi = $index) {
              <div class="rounded-2xl border border-surface-200 bg-surface-0 p-6 shadow-sm">
                <div class="mb-4 flex items-start justify-between gap-3">
                  <div class="flex items-start gap-3 flex-1 min-w-0">
                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 text-sm font-bold">
                      {{ qi + 1 }}
                    </span>
                    <div class="flex-1 min-w-0">
                      <p class="text-body font-medium text-surface-900">{{ question.statement }}</p>
                      <p-tag [value]="labelOf(QUESTION_TYPE_LABELS, question.type)" severity="info" styleClass="!text-xs mt-1" />
                    </div>
                  </div>
                  <p-button
                    icon="pi pi-trash"
                    [rounded]="true"
                    [text]="true"
                    severity="danger"
                    size="small"
                    [disabled]="formationState.saving()"
                    (onClick)="deleteQuestion(question.id)"
                    pTooltip="Eliminar pregunta"
                  />
                </div>

                <div class="flex flex-col gap-2 ml-11">
                  @for (answer of question.answers; track answer.id) {
                    <div class="flex items-center gap-3 rounded-lg px-3 py-2" [class]="answer.correct ? 'bg-green-50 border border-green-200' : 'bg-surface-50'">
                      <p-radiobutton
                        [name]="'correct_' + question.id"
                        [inputId]="answer.id"
                        [value]="true"
                        [ngModel]="answer.correct"
                        [disabled]="true"
                      />
                      <label [for]="answer.id" class="text-body flex-1" [class]="answer.correct ? 'text-green-800 font-medium' : 'text-surface-700'">
                        {{ answer.description }}
                        @if (answer.correct) {
                          <span class="pi pi-check-circle ml-2 text-green-600 text-xs"></span>
                        }
                      </label>
                      <p-button
                        icon="pi pi-trash"
                        [rounded]="true"
                        [text]="true"
                        severity="danger"
                        size="small"
                        [disabled]="formationState.saving()"
                        (onClick)="deleteAnswer(question.id, answer.id)"
                      />
                    </div>
                  }
                </div>

                <div class="ml-11 mt-3">
                  <p-button
                    label="Agregar respuesta"
                    icon="pi pi-plus"
                    severity="secondary"
                    [text]="true"
                    size="small"
                    [disabled]="formationState.saving()"
                    (onClick)="openAddAnswerDialog(question.id, question.type)"
                  />
                </div>
              </div>
            }
          }
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center py-20 text-center">
          <span class="pi pi-clipboard text-4xl text-surface-300 mb-3" aria-hidden="true"></span>
          <p class="text-body text-muted-color mb-4">Este módulo no tiene evaluación.</p>
          <p-button
            label="Crear evaluación"
            icon="pi pi-plus"
            (onClick)="openCreateEvaluationDialog()"
          />
        </div>
      }

      <p-dialog
        [header]="editingEvaluation() ? 'Editar evaluación' : 'Crear evaluación'"
        [modal]="true"
        [visible]="createDialogVisible()"
        (onHide)="createDialogVisible.set(false)"
        [style]="{ width: '32rem' }"
      >
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label for="evalTitle" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Título</label>
            <input
              pInputText
              id="evalTitle"
              [ngModel]="evalTitle()"
              (ngModelChange)="evalTitle.set($event)"
              placeholder="Título de la evaluación..."
              class="w-full"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="evalDescription" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Descripción</label>
            <textarea
              pTextarea
              id="evalDescription"
              [ngModel]="evalDescription()"
              (ngModelChange)="evalDescription.set($event)"
              placeholder="Descripción (opcional)..."
              rows="3"
              class="w-full"
            ></textarea>
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="evalMinScore" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Puntaje mínimo (%)</label>
            <p-inputNumber
              id="evalMinScore"
              [ngModel]="evalMinScore()"
              (ngModelChange)="evalMinScore.set($event)"
              [min]="0"
              [max]="100"
              class="w-full"
            />
          </div>
        </div>
        <ng-template #footer>
          <p-button label="Cancelar" severity="secondary" [text]="true" (onClick)="createDialogVisible.set(false)" />
          <p-button
            [label]="editingEvaluation() ? 'Guardar cambios' : 'Crear evaluación'"
            icon="pi pi-check"
            [loading]="formationState.saving()"
            [disabled]="!evalTitle().trim() || evalMinScore() === null"
            (onClick)="saveEvaluation()"
          />
        </ng-template>
      </p-dialog>

      <p-dialog
        header="Agregar pregunta"
        [modal]="true"
        [visible]="questionDialogVisible()"
        (onHide)="questionDialogVisible.set(false)"
        [style]="{ width: '32rem' }"
      >
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label for="newStatement" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Enunciado</label>
            <textarea
              pTextarea
              id="newStatement"
              [ngModel]="newStatement()"
              (ngModelChange)="newStatement.set($event)"
              placeholder="Ingrese el enunciado..."
              rows="3"
              class="w-full"
            ></textarea>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-caption font-semibold uppercase tracking-wider text-muted-color">Tipo</label>
            <div class="flex gap-4">
              @for (type of questionTypes; track type.value) {
                <div class="flex items-center gap-2">
                  <p-radiobutton
                    [name]="'newQuestionType'"
                    [inputId]="'type_' + type.value"
                    [value]="type.value"
                    [ngModel]="newQuestionType()"
                    (ngModelChange)="newQuestionType.set($event)"
                  />
                  <label [for]="'type_' + type.value" class="text-body">{{ type.label }}</label>
                </div>
              }
            </div>
          </div>
          <p-divider />
          <p class="text-caption font-semibold uppercase tracking-wider text-muted-color">Respuestas</p>
          @for (ans of newAnswers(); track ans.index) {
            <div class="flex items-center gap-2">
              <p-radiobutton
                [name]="'newCorrect'"
                [inputId]="'new_ans_' + ans.index"
                [value]="ans.index"
                [ngModel]="newCorrectIndex()"
                (ngModelChange)="newCorrectIndex.set($event)"
              />
              <input
                pInputText
                [ngModel]="ans.description"
                (ngModelChange)="updateAnswer(ans.index, $event)"
                placeholder="Respuesta..."
                class="flex-1"
              />
              <p-button
                icon="pi pi-times"
                [rounded]="true"
                [text]="true"
                severity="danger"
                size="small"
                (onClick)="removeAnswer(ans.index)"
              />
            </div>
          }
          <p-button
            label="Agregar respuesta"
            icon="pi pi-plus"
            severity="secondary"
            [text]="true"
            size="small"
            [disabled]="newAnswers().length >= 6"
            (onClick)="addAnswer()"
          />
        </div>
        <ng-template #footer>
          <p-button label="Cancelar" severity="secondary" [text]="true" (onClick)="questionDialogVisible.set(false)" />
          <p-button
            label="Crear pregunta"
            icon="pi pi-check"
            [loading]="formationState.saving()"
            [disabled]="!newStatement().trim() || newAnswers().length < 2 || newCorrectIndex() === null"
            (onClick)="createQuestion()"
          />
        </ng-template>
      </p-dialog>

      <p-dialog
        header="Agregar respuesta"
        [modal]="true"
        [visible]="answerDialogVisible()"
        (onHide)="answerDialogVisible.set(false)"
        [style]="{ width: '28rem' }"
      >
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label for="answerDescription" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Respuesta</label>
            <input
              pInputText
              id="answerDescription"
              [ngModel]="answerDescription()"
              (ngModelChange)="answerDescription.set($event)"
              placeholder="Ingrese la respuesta..."
              class="w-full"
              autofocus
            />
          </div>
          <div class="flex items-center gap-2">
            <p-radiobutton
              name="answerCorrect"
              inputId="answerCorrect"
              [value]="true"
              [ngModel]="answerCorrect()"
              (ngModelChange)="answerCorrect.set($event)"
            />
            <label for="answerCorrect" class="text-body">Respuesta correcta</label>
          </div>
        </div>
        <ng-template #footer>
          <p-button label="Cancelar" severity="secondary" [text]="true" (onClick)="answerDialogVisible.set(false)" />
          <p-button
            label="Agregar"
            icon="pi pi-check"
            [loading]="formationState.saving()"
            [disabled]="!answerDescription().trim()"
            (onClick)="saveAnswer()"
          />
        </ng-template>
      </p-dialog>
    </div>
  `
})
export class EvaluationPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly formationState = inject(FormationStateService);
  private readonly messageService = inject(MessageService);

  protected readonly courseId = this.route.snapshot.paramMap.get('courseId') ?? '';
  protected readonly moduleId = this.route.snapshot.paramMap.get('moduleId') ?? '';

  protected readonly createDialogVisible = signal(false);
  protected readonly editingEvaluation = signal(false);
  protected readonly evalTitle = signal('');
  protected readonly evalDescription = signal('');
  protected readonly evalMinScore = signal<number | null>(70);

  protected readonly questionDialogVisible = signal(false);
  protected readonly newStatement = signal('');
  protected readonly newQuestionType = signal<QuestionType>('MULTIPLE_CHOICE');
  protected readonly newAnswers = signal<{ index: number; description: string }[]>([
    { index: 0, description: '' },
    { index: 1, description: '' }
  ]);
  protected readonly newCorrectIndex = signal<number | null>(null);
  private nextAnswerIndex = 2;

  protected readonly answerDialogVisible = signal(false);
  protected readonly answerDescription = signal('');
  protected readonly answerCorrect = signal(false);
  private answerQuestionId = '';

  protected readonly questionTypes = Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => ({ value: value as QuestionType, label }));
  protected readonly QUESTION_TYPE_LABELS = QUESTION_TYPE_LABELS;
  protected readonly labelOf = labelOf;

  ngOnInit(): void {
    if (this.moduleId) {
      void this.formationState.loadEvaluation(this.moduleId);
    }
  }

  protected openCreateEvaluationDialog(): void {
    this.editingEvaluation.set(false);
    this.evalTitle.set('');
    this.evalDescription.set('');
    this.evalMinScore.set(70);
    this.createDialogVisible.set(true);
  }

  protected openEditEvaluationDialog(): void {
    const evaluation = this.formationState.currentEvaluation();
    if (!evaluation) return;
    this.editingEvaluation.set(true);
    this.evalTitle.set(evaluation.title);
    this.evalDescription.set(evaluation.description ?? '');
    this.evalMinScore.set(evaluation.minimumScore);
    this.createDialogVisible.set(true);
  }

  protected async saveEvaluation(): Promise<void> {
    try {
      if (this.editingEvaluation()) {
        await this.formationState.updateEvaluation(this.moduleId, this.evalTitle(), this.evalDescription() || null, this.evalMinScore()!);
        this.messageService.add({ severity: 'success', summary: 'Evaluación actualizada', detail: 'Los datos se actualizaron correctamente.' });
      } else {
        await this.formationState.createEvaluation(this.moduleId, this.evalTitle(), this.evalDescription() || null, this.evalMinScore()!);
        this.messageService.add({ severity: 'success', summary: 'Evaluación creada', detail: 'La evaluación se creó correctamente.' });
      }
      this.createDialogVisible.set(false);
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la evaluación.' });
    }
  }

  protected openAddQuestionDialog(): void {
    this.newStatement.set('');
    this.newQuestionType.set('MULTIPLE_CHOICE');
    this.newAnswers.set([{ index: 0, description: '' }, { index: 1, description: '' }]);
    this.newCorrectIndex.set(null);
    this.nextAnswerIndex = 2;
    this.questionDialogVisible.set(true);
  }

  protected addAnswer(): void {
    this.newAnswers.update((answers) => [...answers, { index: this.nextAnswerIndex++, description: '' }]);
  }

  protected removeAnswer(index: number): void {
    this.newAnswers.update((answers) => answers.filter((a) => a.index !== index));
    if (this.newCorrectIndex() === index) {
      this.newCorrectIndex.set(null);
    }
  }

  protected updateAnswer(index: number, value: string): void {
    this.newAnswers.update((answers) => answers.map((a) => (a.index === index ? { ...a, description: value } : a)));
  }

  protected async createQuestion(): Promise<void> {
    try {
      await this.formationState.addQuestion(this.moduleId, this.newStatement(), this.newQuestionType());
      const evaluation = this.formationState.currentEvaluation();
      if (evaluation) {
        const questionId = evaluation.questions[evaluation.questions.length - 1]?.id;
        if (questionId) {
          for (const ans of this.newAnswers()) {
            if (ans.description.trim()) {
              await this.formationState.addAnswer(this.moduleId, questionId, ans.description.trim(), this.newCorrectIndex() === ans.index);
            }
          }
          await this.formationState.loadEvaluation(this.moduleId);
        }
      }
      this.messageService.add({ severity: 'success', summary: 'Pregunta creada', detail: 'La pregunta se agregó correctamente.' });
      this.questionDialogVisible.set(false);
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la pregunta.' });
    }
  }

  protected async deleteQuestion(questionId: string): Promise<void> {
    try {
      await this.formationState.deleteQuestion(this.moduleId, questionId);
      this.messageService.add({ severity: 'success', summary: 'Pregunta eliminada', detail: 'La pregunta se eliminó correctamente.' });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la pregunta.' });
    }
  }

  protected openAddAnswerDialog(questionId: string, questionType: QuestionType): void {
    this.answerQuestionId = questionId;
    this.answerDescription.set('');
    this.answerCorrect.set(false);
    this.answerDialogVisible.set(true);
  }

  protected async saveAnswer(): Promise<void> {
    try {
      await this.formationState.addAnswer(this.moduleId, this.answerQuestionId, this.answerDescription(), this.answerCorrect());
      this.messageService.add({ severity: 'success', summary: 'Respuesta agregada', detail: 'La respuesta se agregó correctamente.' });
      this.answerDialogVisible.set(false);
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar la respuesta.' });
    }
  }

  protected async deleteAnswer(questionId: string, answerId: string): Promise<void> {
    try {
      await this.formationState.deleteAnswer(this.moduleId, questionId, answerId);
      this.messageService.add({ severity: 'success', summary: 'Respuesta eliminada', detail: 'La respuesta se eliminó correctamente.' });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la respuesta.' });
    }
  }
}
