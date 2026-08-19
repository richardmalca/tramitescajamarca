import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { GuideStep } from '@/types/tramites';

type StepsEditorProps = {
    name: string;
    value: GuideStep[];
    onChange: (value: GuideStep[]) => void;
};

const EMPTY_STEP: GuideStep = { text: '', link: null, link_label: null, image: null };

export default function StepsEditor({ name, value, onChange }: StepsEditorProps) {
    function updateStep(index: number, patch: Partial<GuideStep>) {
        onChange(value.map((step, i) => (i === index ? { ...step, ...patch } : step)));
    }

    function addStep() {
        onChange([...value, { ...EMPTY_STEP }]);
    }

    function removeStep(index: number) {
        onChange(value.filter((_, i) => i !== index));
    }

    return (
        <div className="space-y-3">
            {value.map((step, index) => (
                <div key={index} className="flex gap-3 rounded-lg border border-input p-3">
                    <div className="flex flex-1 flex-col gap-2">
                        <input type="hidden" name={`${name}[${index}][text]`} value={step.text} />
                        <input type="hidden" name={`${name}[${index}][link]`} value={step.link ?? ''} />
                        <input type="hidden" name={`${name}[${index}][link_label]`} value={step.link_label ?? ''} />
                        <input type="hidden" name={`${name}[${index}][image]`} value={step.image ?? ''} />

                        <Label className="text-xs text-muted-foreground">Paso {index + 1}</Label>
                        <textarea
                            value={step.text}
                            onChange={(event) => updateStep(index, { text: event.target.value })}
                            rows={2}
                            placeholder="Describe este paso..."
                            className="flex w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />

                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                value={step.link ?? ''}
                                onChange={(event) => updateStep(index, { link: event.target.value || null })}
                                placeholder="Enlace (opcional) — ej. https://reniec.gob.pe"
                            />
                            <Input
                                value={step.link_label ?? ''}
                                onChange={(event) => updateStep(index, { link_label: event.target.value || null })}
                                placeholder="Texto del botón (ej. Pagar en línea)"
                            />
                        </div>
                        <Input
                            value={step.image ?? ''}
                            onChange={(event) => updateStep(index, { image: event.target.value || null })}
                            placeholder="URL de imagen (opcional) — captura de pantalla del paso"
                        />
                    </div>

                    <div className="flex flex-col items-center gap-1 pt-1 text-muted-foreground">
                        <GripVertical className="size-4" />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeStep(index)}>
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                </div>
            ))}

            <Button type="button" variant="outline" onClick={addStep} className="gap-1.5">
                <Plus className="size-4" />
                Agregar paso
            </Button>
        </div>
    );
}
