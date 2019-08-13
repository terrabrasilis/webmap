/** Angular */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

/** Pipes */
import { CleanWhiteSpacePipe } from "../pipe/clean-white-space.pipe";
import { SafeHtmlPipe } from "../pipe/safe-html.pipe";


@NgModule({
    imports: [
        CommonModule,      
    ],
    declarations: [
        CleanWhiteSpacePipe, SafeHtmlPipe
    ],
    exports: [
        CleanWhiteSpacePipe,
    ]
})
export class PipeSharedModule {}