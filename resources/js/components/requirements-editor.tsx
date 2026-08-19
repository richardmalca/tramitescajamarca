import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type RequirementsEditorProps = {
    name: string;
    value: string[];
    onChange: (value: string[]) => void;
};

export default function RequirementsEditor({
    name,
    value,
    onChange,
}: RequirementsEditorProps) {
    const [draft, setDraft] = useState('');

    function addRequirement() {
        const trimmed = draft.trim();

        if (trimmed.length === 0) {
            return;
        }

        onChange([...value, trimmed]);
        setDraft('');
    }

    function removeRequirement(index: number) {
        onChange(value.filter((_, i) => i !== index));
    }

    return (
        <div className="space-y-2">
            {value.map((requirement, index) => (
                <div key={index} className="flex items-center gap-2">
                    <input
                        type="hidden"
                        name={`${name}[${index}]`}
                        value={requirement}
                    />
                    <span className="flex-1 rounded-md border border-input px-3 py-1.5 text-sm">
                        {requirement}
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRequirement(index)}
                    >
                        <X className="size-4" />
                    </Button>
                </div>
            ))}

            <div className="flex items-center gap-2">
                <Input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            addRequirement();
                        }
                    }}
                    placeholder="Agregar un requisito"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addRequirement}
                >
                    <Plus className="size-4" />
                </Button>
            </div>
        </div>
    );
}
