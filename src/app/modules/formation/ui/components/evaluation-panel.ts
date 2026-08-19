import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';

import type { Answer, Evaluation, Question, QuestionType } from '../../models/formation.model';
import { QUESTION_TYPE_LABELS, labelOf } from '../../models/formation-labels';

@Component({
  selector: 'app-evaluation-panel',
  imports: [
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    TagModule,
    DividerModule,
    RadioButtonModule,
  ],
  template: `
    @if (evaluation()) {
      <p-card styleClass="shadow-sm rounded-2xl">
        <ng-template pTemplate="header">
          <div class="flex items-center justify-between px-4 pt-4">
            <h3 class="text-title font-semibold">{{ evaluation()!.title }}</h3>
            <p-tag [value]="'Mínimo: ' + evaluation()!.minimumScore + '%'" severity="info" />
          </div>
        </ng-template>

        <div class="flex flex-col gap-4">
          @if (evaluation()!.description) {
            <p class="text-body text-muted-color">{{ evaluation()!.description }}</p>
          }

          @if (evaluation()!.questions.length === 0) {
            <p class="text-caption text-muted-color">Sin preguntas</p>
          } @else {
            @for (question of evaluation()!.questions; track question.id; let qi = $index) {
              <div class="rounded-xl border border-surface-200 p-4">
                <div class="mb-3 flex items-start gap-2">
                  <span class="text-body font-medium">{{ qi + 1 }}.</span>
                  <span class="text-body flex-1">{{ question.statement }}</span>
                  <div class="flex items-center gap-2">
                    <p-tag
                      [value]="labelOf(QUESTION_TYPE_LABELS, question.type)"
                      severity="info"
                      styleClass="!text-xs"
                    />
                    <p-button
                      icon="pi pi-trash"
                      [rounded]="true"
                      [text]="true"
                      severity="danger"
                      size="small"
                      [disabled]="saving()"
                      (onClick)="deleteQuestion.emit(question.id)"
                    />
                  </div>
                </div>

                <div class="flex flex-col gap-2 ml-6">
                  @for (answer of question.answers; track answer.id) {
                    <div class="flex items-center gap-2">
                      <p-radiobutton
                        [name]="'correct_' + question.id"
                        [inputId]="answer.id"
                        [value]="true"
                        [ngModel]="answer.correct"
                        [disabled]="saving()"
                        (onClick)="toggleCorrect.emit({ questionId: question.id, answerId: answer.id })"
                      />
                      <label [for]="answer.id" class="text-body flex-1">{{ answer.description }}</label>
                      <p-button
                        icon="pi pi-trash"
                        [rounded]="true"
                        [text]="true"
                        severity="danger"
                        size="small"
                        [disabled]="saving()"
                        (onClick)="deleteAnswer.emit({ questionId: question.id, answerId: answer.id })"
                      />
                    </div>
                  }
                </div>
              </div>
            }
          }

          <p-divider />

          <div class="rounded-xl border border-dashed border-surface-300 p-4">
            <p class="text-title font-semibold mb-3">Agregar pregunta</p>
            <div class="flex flex-col gap-3">
              <div class="flex flex-col gap-1.5">
                <label for="newStatement" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Enunciado</label>
                <input
                  pInputText
                  id="newStatement"
                  [(ngModel)]="newStatement"
                  placeholder="Ingrese el enunciado..."
                  class="w-full"
                  [disabled]="saving()"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="newQuestionType" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Tipo</label>
                <div class="flex gap-4">
                  @for (type of questionTypes; track type.value) {
                    <div class="flex items-center gap-2">
                      <p-radiobutton
                        [name]="'newQuestionType'"
                        [inputId]="'type_' + type.value"
                        [value]="type.value"
                        [(ngModel)]="newQuestionType"
                        [disabled]="saving()"
                      />
                      <label [for]="'type_' + type.value" class="text-body">{{ type.label }}</label>
                    </div>
                  }
                </div>
              </div>
              <div class="flex flex-col gap-2 mt-2">
                @for (ans of newAnswers; track ans.index) {
                  <div class="flex items-center gap-2">
                    <p-radiobutton
                      [name]="'newCorrect'"
                      [inputId]="'new_ans_' + ans.index"
                      [value]="true"
                      [(ngModel)]="newCorrectIndex"
                      [disabled]="saving()"
                    />
                    <input
                      pInputText
                      [ngModel]="ans.description"
                      (ngModelChange)="ans.description = $event"
                      placeholder="Respuesta..."
                      class="flex-1"
                      [disabled]="saving()"
                    />
                    <p-button
                      icon="pi pi-trash"
                      [rounded]="true"
                      [text]="true"
                      severity="danger"
                      size="small"
                      [disabled]="saving()"
                      (onClick)="removeNewAnswer(ans.index)"
                    />
                  </div>
                }
              </div>
              <p-button
                label="Agregar respuesta"
                icon="pi pi-plus"
                severity="secondary"
                [text]="true"
                size="small"
                [disabled]="saving() || newAnswers.length >= 6"
                (onClick)="addNewAnswer()"
              />
              <p-button
                label="Agregar pregunta"
                icon="pi pi-plus"
                [disabled]="saving() || !newStatement.trim() || newAnswers.length < 2 || newCorrectIndex === null"
                (onClick)="onAddQuestion()"
              />
            </div>
          </div>
        </div>
      </p-card>
    } @else {
      <p-card styleClass="shadow-sm rounded-2xl">
        <ng-template pTemplate="header">
          <div class="px-4 pt-4">
            <h3 class="text-title font-semibold">Crear evaluación</h3>
          </div>
        </ng-template>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label for="evalTitle" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Título</label>
            <input
              pInputText
              id="evalTitle"
              [(ngModel)]="evalTitle"
              placeholder="Título de la evaluación..."
              class="w-full"
              [disabled]="saving()"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="evalDescription" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Descripción</label>
            <input
              pInputText
              id="evalDescription"
              [(ngModel)]="evalDescription"
              placeholder="Descripción (opcional)..."
              class="w-full"
              [disabled]="saving()"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="evalMinScore" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Puntaje mínimo (%)</label>
            <p-inputNumber
              id="evalMinScore"
              [(ngModel)]="evalMinScore"
              [min]="0"
              [max]="100"
              [disabled]="saving()"
              class="w-full"
            />
          </div>
          <p-button
            label="Crear evaluación"
            icon="pi pi-check"
            [loading]="saving()"
            [disabled]="!evalTitle.trim() || evalMinScore === null"
            (onClick)="onCreate()"
          />
        </div>
      </p-card>
    }
  `
})
export class EvaluationPanel {
  readonly evaluation = input<Evaluation | null>(null);
  readonly moduleId = input.required<string>();
  readonly saving = input(false);

  readonly create = output<{ title: string; description: string; minimumScore: number }>();
  readonly addQuestion = output<{ statement: string; type: QuestionType }>();
  readonly deleteQuestion = output<string>();
  readonly deleteAnswer = output<{ questionId: string; answerId: string }>();
  readonly toggleCorrect = output<{ questionId: string; answerId: string }>();

  protected evalTitle = '';
  protected evalDescription = '';
  protected evalMinScore: number | null = 70;

  protected newStatement = '';
  protected newQuestionType: QuestionType = 'MULTIPLE_CHOICE';
  protected newAnswers: { index: number; description: string }[] = [
    { index: 0, description: '' },
    { index: 1, description: '' },
  ];
  protected newCorrectIndex: number | null = null;

  private nextAnswerIndex = 2;

  protected readonly questionTypes = Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => ({
    value: value as QuestionType,
    label,
  }));

  protected readonly QUESTION_TYPE_LABELS = QUESTION_TYPE_LABELS;
  protected readonly labelOf = labelOf;

  protected onCreate(): void {
    const title = this.evalTitle.trim();
    if (title && this.evalMinScore !== null) {
      this.create.emit({
        title,
        description: this.evalDescription.trim(),
        minimumScore: this.evalMinScore,
      });
    }
  }

  protected onAddQuestion(): void {
    const statement = this.newStatement.trim();
    if (statement && this.newAnswers.length >= 2 && this.newCorrectIndex !== null) {
      this.addQuestion.emit({ statement, type: this.newQuestionType });
      this.newStatement = '';
      this.newCorrectIndex = null;
      this.newAnswers = [
        { index: 0, description: '' },
        { index: 1, description: '' },
      ];
      this.nextAnswerIndex = 2;
    }
  }

  protected addNewAnswer(): void {
    this.newAnswers.push({ index: this.nextAnswerIndex++, description: '' });
  }

  protected removeNewAnswer(index: number): void {
    this.newAnswers = this.newAnswers.filter(a => a.index !== index);
    if (this.newCorrectIndex === index) {
      this.newCorrectIndex = null;
    }
  }
}
