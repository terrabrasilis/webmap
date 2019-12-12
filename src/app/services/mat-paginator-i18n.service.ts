import { MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable()
export class MatPaginatorI18nService extends MatPaginatorIntl {
    translate: TranslateService;
    firstPageLabel = 'First page';
    itemsPerPageLabel = 'Items per page:';
    lastPageLabel = 'Last page';
    nextPageLabel = 'Next page';
    previousPageLabel = 'Previous page';

    getRangeLabel = (page: number, pageSize: number, length: number): string => {
        const of = this.translate ? this.translate.instant('matPaginatorIntl.of') : 'of';
        if (length === 0 || pageSize === 0) {
            return '0 ' + of + ' ' + length;
        }
        length = Math.max(length, 0);
        const startIndex = ((page * pageSize) > length) ?
            (Math.ceil(length / pageSize) - 1) * pageSize:
            page * pageSize;

        const endIndex = Math.min(startIndex + pageSize, length);
        return startIndex + 1 + ' - ' + endIndex + ' ' + of + ' ' + length;
    };

    injectTranslateService(translate: TranslateService) {
        this.translate = translate;

        this.translate.onLangChange.subscribe(() => {
            this.translateLabels();
        });

        this.translateLabels();
    }

    public translateLabels(): void {

        this.firstPageLabel = this.translate.instant('matPaginatorIntl.firstPage');
        this.itemsPerPageLabel = this.translate.instant('matPaginatorIntl.itemsPerPage');
        this.lastPageLabel = this.translate.instant('matPaginatorIntl.lastPage');
        this.nextPageLabel = this.translate.instant('matPaginatorIntl.nextPage');
        this.previousPageLabel = this.translate.instant('matPaginatorIntl.prevPage');
        this.changes.next();
    }
}